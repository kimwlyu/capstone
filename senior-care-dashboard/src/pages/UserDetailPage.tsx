// src/pages/UserDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
    fetchUserDetails,
    fetchUserUtterances,
    formatDate,
    type UserDetailsResponse,
    type UserUtterance,
} from "@/api/client";
import { useParams } from "react-router-dom";
import { LevelBadge } from "@/components/LevelBadge";

// Recharts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// 위험도 타임라인 (멘탈/신체 색 구분, 고급 그래프)
const RiskTimelineChart = ({
                               history,
                           }: {
    history: UserDetailsResponse["riskHistory"];
}) => {
    if (!history || history.length === 0) {
        return (
            <div className="flex h-52 items-center justify-center text-xs text-slate-400">
                위험도 기록이 없습니다.
            </div>
        );
    }

    // Recharts용 데이터 변환
    const chartData = history.map((item) => {
        const date = new Date(item.createdAt);
        const timeLabel = `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
        ).padStart(2, "0")}`;
        return {
            time: timeLabel,
            mental: item.mentalLevel,
            physical: item.physicalLevel,
        };
    });

    return (
        <div className="h-64 w-full">
            {/* 범례 텍스트 */}
            <div className="mb-2 flex items-center gap-4 text-[11px] text-slate-600">
                <div className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                    <span>멘탈 위험도</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                    <span>신체 위험도</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "#6b7280" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                        domain={[0, 3]}
                        ticks={[0, 1, 2, 3]}
                        tick={{ fontSize: 10, fill: "#6b7280" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                        formatter={(value: any, name: string) => {
                            const label = name === "mental" ? "멘탈 위험도" : "신체 위험도";
                            return [value, label];
                        }}
                        labelFormatter={(label) => `시간: ${label}`}
                        contentStyle={{
                            fontSize: 11,
                            borderRadius: 8,
                            borderColor: "#e5e7eb",
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ fontSize: 11, paddingBottom: 12 }}
                        formatter={(value: string) =>
                            value === "mental" ? "멘탈" : "신체"
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="mental"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="physical"
                        stroke="#f97316"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export const UserDetailPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [details, setDetails] = useState<UserDetailsResponse | null>(null);
    const [utterances, setUtterances] = useState<UserUtterance[]>([]);

    useEffect(() => {
        if (!userId) return;
        const id = Number(userId);

        fetchUserDetails(id).then(setDetails).catch(console.error);
        fetchUserUtterances(id).then(setUtterances).catch(console.error);
    }, [userId]);

    // 24시간 기준 발화(백엔드가 필터링했다고 가정)
    const last24hUtterances = useMemo(() => utterances, [utterances]);

    if (!details) {
        return (
            <AppLayout>
                <div className="text-sm text-slate-500">로딩 중...</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            {/* 상단 사용자 정보 */}
            <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-lg font-semibold text-slate-900">
                    {details.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                    나이 {details.age}세 · {details.region} · {details.phone}
                </div>
            </section>

            {/* 최근 24시간 위험도 타임라인 */}
            <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-slate-900">
                    최근 24시간 위험도 타임라인
                </h2>
                <RiskTimelineChart history={details.riskHistory} />
            </section>

            {/* 최근 발화 내역 (24시간 기준) */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-slate-900">
                    최근 발화 내역 (24시간 기준)
                </h2>
                <div className="space-y-3">
                    {last24hUtterances.map((utt) => {
                        const level = Math.max(
                            utt.riskLevelMental,
                            utt.riskLevelPhysical
                        );
                        return (
                            <div
                                key={utt.utteranceId}
                                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                            >
                                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                    <span>{formatDate(utt.timestamp)}</span>
                                    <LevelBadge level={level} />
                                </div>
                                <div className="mb-2 text-sm text-slate-900">{utt.text}</div>
                                <div className="text-xs text-slate-600">
                                    근거: {utt.reasonText}
                                </div>
                            </div>
                        );
                    })}

                    {last24hUtterances.length === 0 && (
                        <div className="text-sm text-slate-500">
                            최근 24시간 발화가 없습니다.
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
};
