// src/hooks/useRiskAlarmsWS.ts
import { useEffect, useState } from "react";
import type { RealtimeAlarm } from "@/api/client";
import { Client, IMessage } from "@stomp/stompjs";
import { getCombinedUiLevel, isHighRiskUi } from "@/utils/riskLevel";

/**
 * STOMP WebSocket을 통해 /topic/risk-alarms 를 구독해서
 * UI 기준 2단계(최고 위험)일 때만 팝업에 쓸 latestAlarm 을 세팅하는 훅
 */
export function useRiskAlarmsWS() {
    const [latestAlarm, setLatestAlarm] = useState<RealtimeAlarm | null>(null);

    useEffect(() => {
        if (import.meta.env.VITE_WS_DISABLED === "true") {
            console.warn("WebSocket disabled by env");
            return;
        }

        const brokerURL = import.meta.env.VITE_WS_BASE;
        if (!brokerURL) {
            console.warn("VITE_WS_BASE 가 설정되어 있지 않습니다.");
            return;
        }

        // STOMP 클라이언트 생성
        const client = new Client({
            brokerURL, // 예: wss://api.carerobot.shop/ws/risk-alarms
            reconnectDelay: 5000, // 끊어지면 5초마다 재시도
            debug: (str) => {
                console.log("[STOMP]", str);
            },
        });

        client.onConnect = () => {
            console.log("STOMP Connected:", brokerURL);

            // 백엔드가 말한 목적지에 구독
            client.subscribe("/topic/risk-alarms", (message: IMessage) => {
                try {
                    console.log("WS raw:", message.body);
                    const raw = JSON.parse(message.body);

                    // 1) 위험도 숫자 읽기 (여러 이름 대응)
                    const mental =
                        raw.mentalLevel ??
                        raw.mental_level ??
                        raw.riskLevelMental ??
                        raw.risk_level_mental ??
                        0;

                    const physical =
                        raw.physicalLevel ??
                        raw.physical_level ??
                        raw.riskLevelPhysical ??
                        raw.risk_level_physical ??
                        0;

                    const uiLevel = getCombinedUiLevel(mental, physical);

                    // UI 기준 최고 단계(2)가 아니면 팝업 대상 아님
                    if (!isHighRiskUi(uiLevel)) {
                        return;
                    }

                    // 2) RealtimeAlarm 타입에 맞게 매핑
                    const alarm: RealtimeAlarm = {
                        alarmId: raw.alarmId ?? raw.alarm_id ?? 0,
                        userId: raw.userId ?? raw.user_id ?? 0,
                        userName: raw.userName ?? raw.user_name ?? "알 수 없음",
                        mentalLevel: mental,
                        physicalLevel: physical,
                        reasonText:
                            raw.reasonText ??
                            raw.reason_text ??
                            raw.reason ??
                            "",
                        createdAt:
                            raw.createdAt ??
                            raw.created_at ??
                            raw.timestamp ??
                            new Date().toISOString(),
                    };

                    setLatestAlarm(alarm);
                } catch (e) {
                    console.error("알림 파싱 실패", e, message.body);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("STOMP error:", frame.headers["message"], frame.body);
        };

        client.onWebSocketError = (e) => {
            console.error("WebSocket error:", e);
        };

        client.onDisconnect = () => {
            console.warn("STOMP disconnected");
        };

        // 연결 시작
        client.activate();

        // 언마운트 시 연결 해제
        return () => {
            client.deactivate();
        };
    }, []);

    const clearLatestAlarm = () => setLatestAlarm(null);

    return { latestAlarm, clearLatestAlarm };
}
