// src/pages/RiskAlarms.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { fetchRiskAlarms, formatDate, type RiskAlarm } from "@/api/client";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

export const RiskAlarms = () => {
    const [alarms, setAlarms] = useState<RiskAlarm[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRiskAlarms()
            .then((data) => {
                const sorted = [...data].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setAlarms(sorted);
            })
            .catch(console.error);
    }, []);

    const renderLevelChip = (level: number) => {
        const safe = Math.max(0, Math.min(3, level ?? 0));
        if (safe === 0)
            return (
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700">
          ● 위험도 0
        </span>
            );
        if (safe === 1)
            return (
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
          ● 위험도 1
        </span>
            );
        if (safe === 2)
            return (
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
          ● 위험도 2
        </span>
            );
        return (
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
        ● 위험도 3
      </span>
        );
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* 상단 영역 - 완전 흰 배경 + 진한 텍스트 */}
                <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                        <Bell className="h-4 w-4" />
                        위험 알림 로그
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">위험 알림 내역</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        케어봇이 감지한 위험 발화 기록입니다. 항목을 클릭하면 해당 알림의 상세
                        근거를 확인할 수 있습니다.
                    </p>
                </section>

                {/* 알림 리스트 */}
                <section className="space-y-4">
                    {alarms.map((alarm, idx) => {
                        const level = Math.max(alarm.mentalLevel, alarm.physicalLevel);
                        return (
                            <button
                                key={alarm.alarmId}
                                onClick={() => navigate(`/risk-alarms/${alarm.alarmId}`)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm hover:bg-slate-50 transition"
                                style={{
                                    animation: "fadein 0.25s ease-out",
                                    animationDelay: `${idx * 0.03}s`,
                                    animationFillMode: "backwards",
                                }}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="text-sm font-semibold text-slate-900">
                                        {alarm.userName}
                                    </div>
                                    {renderLevelChip(level)}
                                </div>

                                <div className="mb-1 text-xs text-slate-500">
                                    {formatDate(alarm.createdAt)}
                                </div>

                                <div className="line-clamp-2 text-xs text-slate-700">
                                    {alarm.reasonText}
                                </div>
                            </button>
                        );
                    })}

                    {alarms.length === 0 && (
                        <div className="mt-10 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                            아직 알림이 없습니다.
                        </div>
                    )}
                </section>

                <style>{`
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
            </div>
        </AppLayout>
    );
};
