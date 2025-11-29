// src/components/RiskPopup.tsx
import type { RealtimeAlarm } from "@/api/client";
import { LevelBadge } from "./LevelBadge";
import { useNavigate } from "react-router-dom";

interface Props {
    alarm: RealtimeAlarm | null;
    onClose: () => void;
}

export const RiskPopup = ({ alarm, onClose }: Props) => {
    const navigate = useNavigate();

    if (!alarm) return null;

    const combinedLevel = Math.max(alarm.mentalLevel, alarm.physicalLevel);

    const goDetail = () => {
        // 알림 상세 페이지로 이동
        navigate(`/alarms/${alarm.alarmId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative bg-red-600 text-white rounded-2xl shadow-xl p-6 w-[360px] max-w-[90%] animate-fade-in">
                <div className="text-xs font-semibold mb-2">위험도 알림</div>

                <div className="flex items-center gap-3 mb-4">
                    <div>
                        <div className="text-sm font-semibold">
                            {alarm.userName}
                        </div>
                        <div className="text-[11px] opacity-80">
                            {new Date(alarm.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <div className="ml-auto">
                        <LevelBadge level={combinedLevel} />
                    </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 text-sm mb-4">
                    <div className="text-xs mb-1 opacity-80">위험 근거 문장</div>
                    <div className="whitespace-pre-wrap">
                        {alarm.reasonText}
                    </div>
                </div>

                <div className="flex justify-end gap-2 text-xs">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20"
                    >
                        닫기
                    </button>
                    <button
                        type="button"
                        onClick={goDetail}
                        className="px-3 py-2 rounded-full bg-white text-red-700 font-semibold"
                    >
                        알림 상세 보기
                    </button>
                </div>
            </div>
        </div>
    );
};
