// src/components/AlarmModal.tsx
import { ReactNode } from "react";

interface Props {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export const AlarmModal = ({ open, title, children, onClose }: Props) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-[overlayFade_0.25s_ease-out]"
                onClick={onClose}
            />

            {/* 중앙 모달 */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-2xl animate-[modalPop_0.28s_ease-out]">
                    {/* 상단 헤더 */}
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                                Alert
                            </div>
                            <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm font-bold shadow-sm transition hover:bg-slate-200 hover:text-slate-800"
                        >
                            ✕
                        </button>
                    </div>

                    {/* 내용 */}
                    <div className="mt-2 text-sm text-slate-700">{children}</div>

                    {/* 하단 그라데이션 라인 */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-400 via-amber-300 to-rose-400" />
                </div>
            </div>

            <style>{`
        @keyframes overlayFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: translateY(14px) scale(0.96); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
};
