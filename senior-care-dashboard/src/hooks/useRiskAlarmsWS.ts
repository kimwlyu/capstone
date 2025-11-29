// src/hooks/useRiskAlarmsWS.ts
import { useEffect, useState } from "react";
import {
    RealtimeAlarm,
    getCombinedRiskLevel,
    getWebSocketUrl,
} from "@/api/client";

export function useRiskAlarmsWS() {
    const [latestAlarm, setLatestAlarm] = useState<RealtimeAlarm | null>(null);

    useEffect(() => {
        const url = getWebSocketUrl("/ws/risk-alarms");
        const ws = new WebSocket(url);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as RealtimeAlarm;
                const level = getCombinedRiskLevel(
                    data.mentalLevel,
                    data.physicalLevel
                );
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
