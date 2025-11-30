// src/components/StatCard.tsx
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number | string;
    description?: string;
    icon?: ReactNode;
    accent?: "blue" | "emerald" | "slate";
}

const accentMap: Record<string, string> = {
    blue: "from-blue-500 via-sky-400 to-blue-500",
    emerald: "from-emerald-500 via-teal-400 to-emerald-500",
    slate: "from-slate-500 via-slate-400 to-slate-500",
};

export const StatCard = ({
                             title,
                             value,
                             description,
                             icon,
                             accent = "blue",
                         }: StatCardProps) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            {/* 위쪽 그라데이션 바 */}
            <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accentMap[accent]}`}
            />

            <div className="flex items-start justify-between gap-3 pt-3">
                <div className="flex flex-col gap-1">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {title}
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">{value}</div>
                    {description && (
                        <div className="text-[11px] text-slate-500 leading-snug">
                            {description}
                        </div>
                    )}
                </div>

                {icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-700 shadow-[0_0_0_1px_rgba(148,163,184,0.45)]">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};
