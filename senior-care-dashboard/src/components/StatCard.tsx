// src/components/StatCard.tsx
interface StatCardProps {
    title: string;
    value: number | string;
    description?: string;
}

export const StatCard = ({ title, value, description }: StatCardProps) => {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-500 mb-1">{title}</div>
            <div className="text-2xl font-semibold text-slate-900">{value}</div>
            {description && (
                <div className="mt-1 text-[11px] text-slate-500">{description}</div>
            )}
        </div>
    );
};
