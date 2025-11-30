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
        // 알림 상세 페이지로 이동 (기존 로직 그대로 유지)
        navigate(`/alarms/${alarm.alarmId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

            <div className="relative w-[360px] max-w-[90%] rounded-3xl border border-red-200 bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 p-[1px] shadow-[0_24px_80px_rgba(248,113,113,0.8)] animate-[riskPop_0.26s_ease-out]">
                <div className="rounded-[20px] bg-slate-950/90 px-5 py-4 text-white">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200/90">
                        위험도 알림
                    </div>

                    <div className="mb-4 flex items-center gap-3">
                        <div>
                            <div className="text-sm font-semibold">{alarm.userName}</div>
                            <div className="text-[11px] opacity-80">
                                {new Date(alarm.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div className="ml-auto">
                            <LevelBadge level={combinedLevel} />
                        </div>
                    </div>

                    <div className="mb-4 rounded-xl bg-white/5 p-3 text-sm">
                        <div className="mb-1 text-[11px] opacity-80">위험 근거 문장</div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {alarm.reasonText}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 text-xs">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full bg-white/5 px-3 py-2 text-slate-100 hover:bg-white/10"
                        >
                            닫기
                        </button>
                        <button
                            type="button"
                            onClick={goDetail}
                            className="rounded-full bg-white px-3 py-2 font-semibold text-red-700 hover:bg-slate-100"
                        >
                            알림 상세 보기
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes riskPop {
          0% { opacity: 0; transform: translateY(14px) scale(0.96); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
};
