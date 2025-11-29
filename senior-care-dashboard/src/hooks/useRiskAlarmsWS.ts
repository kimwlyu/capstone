// src/hooks/useRiskAlarmsWS.ts
import { useEffect, useState } from "react";
import { getWebSocketUrl, type RealtimeAlarm } from "@/api/client";

// WebSocket 으로 최신 위험 알림 한 건만 받아오는 훅
export function useRiskAlarmsWS() {
    const [latestAlarm, setLatestAlarm] = useState<RealtimeAlarm | null>(null);

    useEffect(() => {
        const url = getWebSocketUrl("/ws/risk-alarms");
        const ws = new WebSocket(url);

        ws.onmessage = (event) => {
            try {
                const data: RealtimeAlarm = JSON.parse(event.data);

                // 정신/신체 중 더 높은 등급
                const level = Math.max(data.mentalLevel, data.physicalLevel);

                // 최고 등급(3)일 때만 팝업용으로 저장
                if (level === 3) {
                    setLatestAlarm(data);
                }
            } catch (e) {
                console.error("알림 파싱 실패", e);
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket 에러", e);
        };

        return () => {
            ws.close();
        };
    }, []);

    const clearLatestAlarm = () => setLatestAlarm(null);

    return { latestAlarm, clearLatestAlarm };
}
