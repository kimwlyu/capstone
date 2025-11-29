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
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border rounded-xl shadow-lg z-40">
            <div className="px-4 py-2 border-b flex items-center justify-between">
                <span className="text-sm font-semibold">최고 위험도 알림</span>
                <span className="text-xs text-slate-500">최신 순</span>
            </div>
            {alarms.length === 0 ? (
                <div className="px-4 py-6 text-xs text-slate-500 text-center">
                    아직 수신된 최고 위험 알림이 없습니다.
                </div>
            ) : (
                <ul className="divide-y text-sm">
                    {alarms.map((alarm) => (
                        <li
                            key={alarm.alarmId}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer"
                            onClick={() => onClickAlarm(alarm.alarmId)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold">{alarm.userName}</span>
                                <div className="flex gap-1">
                                    <LevelBadge level={alarm.mentalLevel} />
                                    <LevelBadge level={alarm.physicalLevel} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 mb-1">
                                {alarm.reasonText}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                {new Date(alarm.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
