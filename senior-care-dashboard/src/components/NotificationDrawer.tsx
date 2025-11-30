// src/components/NotificationDrawer.tsx
import { RiskAlarm } from "@/types/types";
import { LevelBadge } from "./LevelBadge";

interface Props {
    open: boolean;
    alarms: RiskAlarm[];
    onClickAlarm: (alarmId: number) => void;
}

export const NotificationDrawer = ({ open, alarms, onClickAlarm }: Props) => {
    if (!open) return null;

    return (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl z-40 animate-[drawerDrop_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
        <span className="text-sm font-semibold text-slate-900">
          최고 위험도 알림
        </span>
                <span className="text-xs text-slate-500">최신 순</span>
            </div>
            {alarms.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-slate-500">
                    아직 수신된 최고 위험 알림이 없습니다.
                </div>
            ) : (
                <ul className="divide-y text-sm">
                    {alarms.map((alarm) => (
                        <li
                            key={alarm.alarmId}
                            className="cursor-pointer px-4 py-3 transition hover:bg-slate-50"
                            onClick={() => onClickAlarm(alarm.alarmId)}
                        >
                            <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {alarm.userName}
                </span>
                                <div className="flex gap-1">
                                    <LevelBadge level={alarm.mentalLevel} />
                                    <LevelBadge level={alarm.physicalLevel} />
                                </div>
                            </div>
                            <p className="mb-1 line-clamp-2 text-xs text-slate-600">
                                {alarm.reasonText}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                {new Date(alarm.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            <style>{`
        @keyframes drawerDrop {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};
