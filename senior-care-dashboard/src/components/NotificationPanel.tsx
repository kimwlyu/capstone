// src/components/NotificationPanel.tsx
import { useEffect, useState } from "react";
import { fetchRiskAlarms, formatDate, type RiskAlarm } from "@/api/client";
import { LevelBadge } from "./LevelBadge";
import { useNavigate } from "react-router-dom";

interface Props {
    onClose: () => void;
}

const NotificationPanel = ({ onClose }: Props) => {
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
        <div className="absolute right-8 top-16 z-40 w-96 rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">
                    최고 위험도 알림
                </h2>
                <button
                    className="text-xs text-slate-500 hover:text-slate-700"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
                {alarms.length === 0 && (
                    <div className="px-3 py-4 text-xs text-slate-500">
                        아직 알림이 없습니다.
                    </div>
                )}

                {alarms.map((alarm) => {
                    const level = Math.max(alarm.mentalLevel, alarm.physicalLevel);
                    return (
                        <button
                            key={alarm.alarmId}
                            className="flex w-full flex-col gap-1 rounded-xl px-3 py-2 text-left hover:bg-slate-50"
                            onClick={() => {
                                navigate(`/risk-alarms/${alarm.alarmId}`);
                                onClose();
                            }}
                        >
                            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  {alarm.userName}
                </span>
                                <LevelBadge level={level} />
                            </div>
                            <div className="text-xs text-slate-500">
                                {formatDate(alarm.createdAt)}
                            </div>
                            <div className="line-clamp-2 text-xs text-slate-700">
                                {alarm.reasonText}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default NotificationPanel;
