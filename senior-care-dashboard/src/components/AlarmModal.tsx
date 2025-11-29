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
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-700"
                        >
                            ✕
                        </button>
                    </div>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};
