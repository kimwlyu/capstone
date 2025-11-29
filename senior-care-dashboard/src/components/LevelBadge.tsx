// src/components/LevelBadge.tsx
interface Props {
    level: number; // 0~3
}

const LABEL: Record<number, string> = {
    0: "위험도 0",
    1: "위험도 1",
    2: "위험도 2",
    3: "위험도 3",
};

const COLOR: Record<number, string> = {
    0: "bg-slate-100 text-slate-600",
    1: "bg-emerald-100 text-emerald-700",
    2: "bg-amber-100 text-amber-700",
    3: "bg-red-100 text-red-700",
};

export const LevelBadge = ({ level }: Props) => {
    const safe = Math.max(0, Math.min(3, level ?? 0));
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                COLOR[safe]
            }`}
        >
      {LABEL[safe]}
    </span>
    );
};
