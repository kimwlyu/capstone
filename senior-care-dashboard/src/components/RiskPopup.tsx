// src/components/RiskPopup.tsx
import type { RealtimeAlarm } from "@/api/client";
import { LevelBadge } from "./LevelBadge";
import { getCombinedUiLevel, isHighRiskUi } from "@/utils/riskLevel";

interface Props {
    alarm: RealtimeAlarm | null;
    onClose: () => void;
}

export const RiskPopup = ({ alarm, onClose }: Props) => {
    if (!alarm) return null;

    // 백엔드 정신/신체 레벨 → UI 레벨(0~2)
    const uiLevel = getCombinedUiLevel(alarm.mentalLevel, alarm.physicalLevel);

    // UI 기준 2단계가 아니면 팝업/블러 없음
    if (!isHighRiskUi(uiLevel)) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 블러 배경 */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

            {/* 팝업 카드 */}
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
                            <LevelBadge level={uiLevel} />
                        </div>
                    </div>

                    <div className="mb-4 rounded-xl bg-white/5 p-3 text-sm">
                        <div className="mb-1 text-[11px] opacity-80">위험 근거 문장</div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {alarm.reasonText}
                        </div>
                    </div>

                    {/* 버튼 영역: 닫기만 남김 */}
                    <div className="flex justify-end text-xs">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full bg-white/5 px-3 py-2 text-slate-100 hover:bg-white/10"
                        >
                            닫기
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
