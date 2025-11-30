// src/components/AlarmPopup.tsx
interface Props {
    message: string;
}

export const AlarmPopup = ({ message }: Props) => {
    if (!message) return null;

    return (
        <div className="fixed bottom-4 right-4 z-30">
            <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 px-4 py-2 text-xs text-white shadow-[0_18px_45px_rgba(248,113,113,0.6)] animate-[toastSlide_0.25s_ease-out]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[13px] font-semibold">
                    !
                </div>
                <div className="max-w-xs leading-snug">{message}</div>
            </div>

            <style>{`
        @keyframes toastSlide {
          0% { opacity: 0; transform: translateY(10px) translateX(8px); }
          100% { opacity: 1; transform: translateY(0) translateX(0); }
        }
      `}</style>
        </div>
    );
};
