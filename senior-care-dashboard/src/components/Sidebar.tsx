// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

const base =
    "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors";
const active = "bg-slate-900 text-white";
const inactive = "text-slate-700 hover:bg-slate-100";

export const Sidebar = () => {
    return (
        <aside className="flex w-56 flex-col border-r border-slate-200 bg-white">
            <div className="px-4 py-4 text-lg font-bold text-slate-900">
                SeniorCare
            </div>
            <nav className="flex-1 space-y-1 px-2">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${base} ${isActive ? active : inactive}`
                    }
                >
                    대시보드
                </NavLink>
                <NavLink
                    to="/risk-alarms"
                    className={({ isActive }) =>
                        `${base} ${isActive ? active : inactive}`
                    }
                >
                    위험 알림 내역
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `${base} ${isActive ? active : inactive}`
                    }
                >
                    사용자 목록
                </NavLink>
            </nav>
        </aside>
    );
};
