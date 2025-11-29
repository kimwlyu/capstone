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
        <header className="relative flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
            <h1 className="text-lg font-semibold text-slate-900">
                SeniorCare 관리자 대시보드
            </h1>
            <div className="flex items-center gap-4">
                {/* 종 아이콘 */}
                <button
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                </button>

                {/* 로그아웃 */}
                <button
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>

            {open && <NotificationPanel onClose={() => setOpen(false)} />}
        </header>
    );
};
