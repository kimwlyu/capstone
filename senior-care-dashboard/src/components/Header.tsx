// src/components/Header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

export const Header = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/login", { replace: true });
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/60 bg-slate-950/85 px-8 backdrop-blur-md shadow-[0_1px_0_rgba(15,23,42,0.7)]">
            {/* 왼쪽 타이틀 */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-sky-300/80">
                    <span>SeniorCare</span>
                    <span className="h-[1px] w-6 bg-slate-700" />
                    <span>Admin</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                    <h1 className="text-base font-semibold text-slate-50">
                        위험도 모니터링 대시보드
                    </h1>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/40">
            실시간 분석
          </span>
                </div>
            </div>

            {/* 오른쪽 알림/로그아웃 */}
            <div className="flex items-center gap-4">
                {/* 종 아이콘 */}
                <button
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-500/60 bg-sky-500/15 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(56,189,248,0.35)] hover:bg-sky-500/25"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="sr-only">위험 알림</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5m2 4a2 2 0 0 0 2-2H9a2 2 0 0 0 2 2z"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* 빨간 점 애니메이션 */}
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 ring-2 ring-slate-950 animate-ping-slow" />
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500" />
                </button>

                {/* 로그아웃 */}
                <button
                    className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.5)] hover:-translate-y-0.5"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>

            {open && <NotificationPanel onClose={() => setOpen(false)} />}

            <style>{`
        .animate-ping-slow {
          animation: pingSlow 1.3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.9); opacity: 0; }
        }
      `}</style>
        </header>
    );
};
