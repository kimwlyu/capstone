// src/pages/RiskAlarms.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { fetchRiskAlarms, formatDate, type RiskAlarm } from "@/api/client";
import { LevelBadge } from "@/components/LevelBadge";
import { useNavigate } from "react-router-dom";

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

    return (
        <AppLayout>
            <h2 className="mb-6 text-base font-semibold text-slate-900">
                위험 알림 내역
            </h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            사용자
                        </th>
                        <th className="w-1/6 px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            위험도
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            근거
                        </th>
                        <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            발생 시간
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {alarms.map((alarm) => {
                        const level = Math.max(alarm.mentalLevel, alarm.physicalLevel);
                        return (
                            <tr
                                key={alarm.alarmId}
                                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                                onClick={() => navigate(`/risk-alarms/${alarm.alarmId}`)}
                            >
                                <td className="px-6 py-3 text-sm text-slate-900">
                                    {alarm.userName}
                                </td>
                                <td className="px-6 py-3">
                                    <LevelBadge level={level} />
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-700">
                                    <span className="line-clamp-1">{alarm.reasonText}</span>
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-500">
                                    {formatDate(alarm.createdAt)}
                                </td>
                            </tr>
                        );
                    })}
                    {alarms.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-6 py-6 text-center text-sm text-slate-500"
                            >
                                알림이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
};
