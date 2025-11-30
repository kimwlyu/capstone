// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const base =
    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all";
const active =
    "bg-slate-950 text-sky-100 shadow-[0_8px_24px_rgba(15,23,42,0.6)] translate-x-1";
const inactive =
    "text-blue-100/80 hover:bg-sky-500/10 hover:text-white/95 hover:translate-x-1";

export const Sidebar = () => {
    return (
        <aside className="relative z-20 flex w-64 flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
            {/* 로고 / 제목 */}
            <div className="border-b border-slate-800/80 px-5 py-5">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 text-[18px] font-bold shadow-[0_10px_30px_rgba(56,189,248,0.6)]">
                        S
                    </div>
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.28em] text-sky-300/90">
                            SeniorCare
                        </div>
                        <div className="text-sm font-semibold text-slate-50">
                            관리자 대시보드
                        </div>
                    </div>
                </div>
                <div className="mt-3 rounded-xl bg-slate-800/70 px-3 py-2 text-[11px] text-slate-200">
                    독거노인 발화 위험도를 실시간으로 모니터링합니다.
                </div>
            </div>

            {/* 네비게이션 */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
                >
                    <span className="text-base">📊</span>
                    <span>대시보드</span>
                </NavLink>

                <NavLink
                    to="/risk-alarms"
                    className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
                >
                    <span className="text-base">🔔</span>
                    <span>위험 알림 내역</span>
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
                >
                    <span className="text-base">👥</span>
                    <span>사용자 목록</span>
                </NavLink>
            </nav>

            {/* 하단 정보 */}
            <div className="border-t border-slate-800/80 px-5 py-3 text-[11px] text-slate-400/90">
                © 2025 SeniorCare · Admin
            </div>
        </aside>
    );
};
