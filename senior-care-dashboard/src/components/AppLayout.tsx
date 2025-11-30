// src/components/AppLayout.tsx
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useRiskAlarmsWS } from "@/hooks/useRiskAlarmsWS";
import { RiskPopup } from "./RiskPopup";

interface Props {
    children: ReactNode;
}

export default function AppLayout({ children }: Props) {
    // STOMP WebSocket 훅
    const { latestAlarm, clearLatestAlarm } = useRiskAlarmsWS();

    // 팝업 떠 있을 때만 메인 영역 블러
    const isBlurred = !!latestAlarm;

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
                    <div className="mx-auto max-w-7xl space-y-6">{children}</div>
                </main>

                {/* STOMP로 받은 최고 위험(UI 기준 2단계) 팝업 */}
                <RiskPopup alarm={latestAlarm} onClose={clearLatestAlarm} />
            </div>

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
