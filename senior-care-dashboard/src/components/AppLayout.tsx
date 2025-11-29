// src/components/AppLayout.tsx
import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { getWebSocketUrl, type RealtimeAlarm } from "@/api/client";
import { LevelBadge } from "./LevelBadge";

interface Props {
    children: ReactNode;
}

export default function AppLayout({ children }: Props) {
    const [popupAlarm, setPopupAlarm] = useState<RealtimeAlarm | null>(null);
    const [isBlurred, setIsBlurred] = useState(false);

    useEffect(() => {
        const wsUrl = getWebSocketUrl("/ws/risk-alarms");
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            try {
                const alarm: RealtimeAlarm = JSON.parse(event.data);
                const level = Math.max(alarm.mentalLevel, alarm.physicalLevel);
                if (level === 3) {
                    setPopupAlarm(alarm);
                    setIsBlurred(true);
                }
            } catch (e) {
                console.error("WebSocket message parsing error:", e);
            }
        };

        ws.onerror = () => console.error("WebSocket connection error");
        ws.onclose = () => console.log("WebSocket closed");

        return () => ws.close();
    }, []);

    const closePopup = () => {
        setPopupAlarm(null);
        setIsBlurred(false);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <div className="relative flex flex-1 flex-col">
                <Header />
                <main
                    className={`flex-1 overflow-y-auto p-8 transition-all ${
                        isBlurred ? "pointer-events-none blur-sm" : ""
                    }`}
                >
                    {children}
                </main>

                {popupAlarm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-fade-in">
                            <h2 className="mb-4 text-lg font-semibold text-red-600">
                                🔔 최고 위험도 감지됨!
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="font-bold text-slate-900">
                                    {popupAlarm.userName}
                                </div>
                                <LevelBadge
                                    level={Math.max(
                                        popupAlarm.mentalLevel,
                                        popupAlarm.physicalLevel
                                    )}
                                />
                                <div className="text-slate-700">
                  <span className="font-semibold text-red-700">
                    근거 문장:
                  </span>
                                    <br />
                                    {popupAlarm.reasonText}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    {new Date(popupAlarm.createdAt).toLocaleString()}
                                </div>
                                <button
                                    onClick={closePopup}
                                    className="mt-2 w-full rounded-xl bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .animate-fade-in {
          animation: fadeIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
