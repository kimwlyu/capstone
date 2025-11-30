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
import { useParams, useNavigate } from "react-router-dom";
import { LevelBadge } from "@/components/LevelBadge";
import { ArrowLeft } from "lucide-react";
import {
    mapRawToUiLevel,
    getCombinedUiLevel,
} from "@/utils/riskLevel";

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

    // Recharts용 데이터 변환 (백엔드 → UI 레벨)
    const chartData = history.map((item) => {
        const date = new Date(item.createdAt);
        const timeLabel = `${String(date.getHours()).padStart(
            2,
            "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}`;

        return {
            time: timeLabel,
            mental: mapRawToUiLevel(item.mentalLevel),
            physical: mapRawToUiLevel(item.physicalLevel),
        };
    });

    return (
        <div className="h-64 w-full">
            {/* 범례 텍스트 */}
            <div className="mb-2 flex items-center gap-4 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
                    <span>멘탈 위험도</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
                    <span>신체 위험도</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={{ stroke: "#1f2937" }}
                        tickLine={{ stroke: "#1f2937" }}
                    />
                    <YAxis
                        domain={[0, 2]}
                        ticks={[0, 1, 2]}
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={{ stroke: "#1f2937" }}
                        tickLine={{ stroke: "#1f2937" }}
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
                            borderColor: "#374151",
                            backgroundColor: "#020617",
                            color: "#e5e7eb",
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ fontSize: 11, paddingBottom: 12, color: "#e5e7eb" }}
                        formatter={(value: string) => (value === "mental" ? "멘탈" : "신체")}
                    />
                    <Line
                        type="monotone"
                        dataKey="mental"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="physical"
                        stroke="#fb923c"
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
    const navigate = useNavigate();

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
                <div className="text-sm text-slate-400">로딩 중...</div>
            </AppLayout>
        );
    }

    // 누적 최고 "원본" 위험도 → UI 레벨로 변환
    const highestRaw = details.riskHistory?.length
        ? Math.max(
            ...details.riskHistory.map((h) =>
                Math.max(h.mentalLevel, h.physicalLevel)
            )
        )
        : 0;
    const highestLevelUi = mapRawToUiLevel(highestRaw);

    return (
        <AppLayout>
            {/* 상단 헤더 + 요약 */}
            <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
                    >
                        <ArrowLeft size={14} />
                        목록으로 돌아가기
                    </button>

                    <div className="text-[11px] text-slate-400">
                        사용자 ID : {details.userId}
                    </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="text-lg font-semibold text-slate-50">
                            {details.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-300">
                            나이 {details.age}세 · {details.region} · {details.phone}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                        <div className="text-xs text-slate-400">
                            누적 최고 위험도 등급
                        </div>
                        {/* UI 레벨 기준으로 통일 */}
                        <LevelBadge level={highestLevelUi} />
                    </div>
                </div>
            </section>

            {/* 최근 24시간 위험도 타임라인 */}
            <section className="mb-6 rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
                <h2 className="mb-2 text-sm font-semibold text-slate-50">
                    최근 24시간 위험도 타임라인
                </h2>
                <p className="mb-4 text-xs text-slate-400">
                    발화 시점별로 멘탈·신체 위험도의 변화를 한눈에 볼 수 있습니다.
                </p>
                <RiskTimelineChart history={details.riskHistory} />
            </section>

            {/* 최근 발화 내역 (24시간 기준) */}
            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
                <h2 className="mb-2 text-sm font-semibold text-slate-50">
                    최근 발화 내역 (24시간 기준)
                </h2>
                <p className="mb-4 text-xs text-slate-400">
                    관리자에게 알림을 보냈던 발화와 그 근거 문장을 확인할 수 있습니다.
                </p>
                <div className="space-y-3">
                    {last24hUtterances.map((utt) => {
                        const rawLevel = Math.max(
                            utt.riskLevelMental,
                            utt.riskLevelPhysical
                        );
                        const uiLevel = mapRawToUiLevel(rawLevel);

                        return (
                            <div
                                key={utt.utteranceId}
                                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:bg-slate-900/90"
                            >
                                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                                    <span>{formatDate(utt.timestamp)}</span>
                                    <LevelBadge level={uiLevel} />
                                </div>
                                <div className="mb-2 text-sm text-slate-100">{utt.text}</div>
                                <div className="text-xs text-slate-300">
                                    근거 문장: {utt.reasonText}
                                </div>
                            </div>
                        );
                    })}

                    {last24hUtterances.length === 0 && (
                        <div className="text-sm text-slate-400">
                            최근 24시간 발화가 없습니다.
                        </div>
                    )}
                </div>
            </section>
        </AppLayout>
    );
};
