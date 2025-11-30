// src/hooks/useRiskAlarmsWS.ts
import { useEffect, useState } from "react";
import { RealtimeAlarm } from "@/api/client";

export function useRiskAlarmsWS() {
    const [latestAlarm, setLatestAlarm] = useState<RealtimeAlarm | null>(null);

    useEffect(() => {
        // WebSocket Disable 설정 확인
        if (import.meta.env.VITE_WS_DISABLED === "true") {
            console.warn("WebSocket disabled by env");
            return;
        }

        // 환경 변수에서 WebSocket 주소 읽기
        const wsUrl =
            import.meta.env.VITE_WS_BASE ||
            (window.location.protocol === "https:"
                ? `wss://${window.location.host}/ws/risk-alarms`
                : `ws://${window.location.host}/ws/risk-alarms`);

        console.log("WebSocket connecting to:", wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket Connected:", wsUrl);
        };

        ws.onmessage = (event) => {
            try {
                const data: RealtimeAlarm = JSON.parse(event.data);

                const level = Math.max(data.mentalLevel, data.physicalLevel);

                if (level === 3) {
                    setLatestAlarm(data);
                }
            } catch (e) {
                console.error("알림 파싱 실패", event.data);
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket 에러", e);
        };

        ws.onclose = () => {
            console.warn("WebSocket closed");
        };

        return () => {
            ws.close();
        };
    }, []);

    const clearLatestAlarm = () => setLatestAlarm(null);

    return { latestAlarm, clearLatestAlarm };
}
