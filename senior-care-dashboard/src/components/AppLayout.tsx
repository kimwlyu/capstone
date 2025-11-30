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
        <div className="min-h-screen flex bg-slate-100">
            {/* 왼쪽 사이드바 */}
            <Sidebar />

            {/* 오른쪽 메인 영역 */}
            <div className="relative flex flex-1 flex-col">
                <Header />

                <main
                    className={`flex-1 overflow-y-auto px-8 py-6 transition-all duration-300 animate-page-enter ${
                        isBlurred ? "pointer-events-none blur-sm" : ""
                    }`}
                >
                    {/* 메인 컨텐츠 래퍼 */}
                    <div className="mx-auto max-w-7xl space-y-6">{children}</div>
                </main>

                {/* 최고 위험도 팝업 */}
                {popupAlarm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
                        <div className="relative w-full max-w-lg rounded-3xl bg-white/95 p-6 shadow-2xl animate-popup-bounce">
                            <div className="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-gradient-to-tr from-red-500 to-amber-400 text-white flex items-center justify-center text-xl font-bold alarm-pulse-ring">
                                !
                            </div>

                            <h2 className="mb-4 mt-3 text-lg font-semibold text-red-600">
                                최고 위험도 감지됨
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

                                <div className="rounded-xl bg-red-50 px-4 py-3 text-slate-800">
                                    <div className="mb-1 text-xs font-semibold text-red-700">
                                        근거 문장
                                    </div>
                                    <div className="text-sm leading-relaxed">
                                        {popupAlarm.reasonText}
                                    </div>
                                </div>

                                <div className="text-[11px] text-slate-500">
                                    {new Date(popupAlarm.createdAt).toLocaleString()}
                                </div>

                                <button
                                    onClick={closePopup}
                                    className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 페이지/팝업 애니메이션 정의 */}
            <style>{`
        .animate-page-enter {
          animation: pageEnter 0.35s ease-out;
        }
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-popup-bounce {
          animation: popupBounce 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        @keyframes popupBounce {
          0% { opacity: 0; transform: translateY(12px) scale(0.96); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .alarm-pulse-ring::after {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          border-width: 2px;
          border-style: solid;
          border-color: rgba(248, 113, 113, 0.7);
          animation: alarmPulse 1.4s ease-out infinite;
        }
        @keyframes alarmPulse {
          0% { opacity: 0.9; transform: scale(0.9); }
          100% { opacity: 0; transform: scale(1.3); }
        }
      `}</style>
        </div>
    );
}
