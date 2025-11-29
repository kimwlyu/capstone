// src/components/RiskPopup.tsx
import { RiskAlarmWSMessage } from "@/hooks/useRiskAlarmsWS";
import { LevelBadge } from "./LevelBadge";
import { useNavigate } from "react-router-dom";

interface Props {
    alarm: RiskAlarmWSMessage | null;
    onClose: () => void;
}

export const RiskPopup = ({ alarm, onClose }: Props) => {
    const navigate = useNavigate();

    if (!alarm) return null;

    const goDetail = () => {
        if (alarm.alarmId != null) {
            navigate(`/risk-alarms/${alarm.alarmId}`);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-lg bg-red-600 text-white rounded-2xl shadow-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">⚠ 최고 위험 등급 감지</h2>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold">
                                {alarm.userName ?? "Unknown"}
                            </div>
                            <div className="flex gap-2">
                                <LevelBadge level={alarm.mentalLevel} />
                                <LevelBadge level={alarm.physicalLevel} />
                            </div>
                        </div>
                        <p className="text-xs text-white/80">
                            감지 시각:{" "}
                            {alarm.createdAt
                                ? new Date(alarm.createdAt).toLocaleString()
                                : "-"}
                        </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 text-sm leading-relaxed">
                        <div className="font-semibold mb-1">판단 근거</div>
                        <p>{alarm.reasonText || "근거 문장이 없습니다."}</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium"
                        >
                            닫기
                        </button>
                        <button
                            onClick={goDetail}
                            className="px-4 py-2 rounded-full bg-white text-red-700 text-sm font-semibold"
                        >
                            알림 상세 보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
