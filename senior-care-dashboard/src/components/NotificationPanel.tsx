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
        <div className="absolute right-8 top-16 z-40 w-96 rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-[0_20px_60px_rgba(15,23,42,0.9)] animate-[panelFade_0.22s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-700/70 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-50">
                    최고 위험도 알림
                </h2>
                <button
                    className="text-xs text-slate-400 hover:text-slate-100"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
                {alarms.length === 0 && (
                    <div className="px-3 py-4 text-xs text-slate-400">
                        아직 알림이 없습니다.
                    </div>
                )}

                {alarms.map((alarm) => {
                    const level = Math.max(alarm.mentalLevel, alarm.physicalLevel);
                    return (
                        <button
                            key={alarm.alarmId}
                            className="flex w-full flex-col gap-1 rounded-xl px-3 py-2 text-left transition hover:bg-slate-800/80"
                            onClick={() => {
                                navigate(`/risk-alarms/${alarm.alarmId}`);
                                onClose();
                            }}
                        >
                            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-50">
                  {alarm.userName}
                </span>
                                <LevelBadge level={level} />
                            </div>
                            <div className="text-[11px] text-slate-400">
                                {formatDate(alarm.createdAt)}
                            </div>
                            <div className="line-clamp-2 text-xs text-slate-200">
                                {alarm.reasonText}
                            </div>
                        </button>
                    );
                })}
            </div>

            <style>{`
        @keyframes panelFade {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default NotificationPanel;
