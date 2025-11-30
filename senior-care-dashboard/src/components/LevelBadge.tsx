// src/components/LevelBadge.tsx

interface Props {
    // UI 기준 레벨 (0: 정상, 1: 주의, 2: 위험)
    level: number;
}

const LABEL: Record<number, string> = {
    0: "위험도 0",
    1: "위험도 1",
    2: "위험도 2",
};

const COLOR: Record<number, string> = {
    0: "bg-slate-800/50 text-slate-200 border border-slate-500/80",
    1: "bg-amber-500/15 text-amber-100 border border-amber-300/70",
    2: "bg-red-500/20 text-red-100 border border-red-400/80",
};

export const LevelBadge = ({ level }: Props) => {
    const safe = Math.max(0, Math.min(2, level ?? 0)); // 0~2로 고정

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold leading-none shadow-sm ${COLOR[safe]}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {LABEL[safe]}
        </span>
    );
};
