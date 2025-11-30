// src/pages/RiskAlarmDetailPage.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchRiskAlarms, formatDate } from "@/api/client";
import { LevelBadge } from "@/components/LevelBadge";
import { mapRawToUiLevel } from "@/utils/riskLevel";
import { ArrowLeft } from "lucide-react";

// 알림 데이터 형태 (타입 꼬일까봐 any 기반으로 느슨하게 정의)
interface AlarmLike {
    alarmId: number;
    userId: number;
    userName?: string;
    createdAt: string;
    riskLevelMental?: number;
    riskLevelPhysical?: number;
    mentalLevel?: number;
    physicalLevel?: number;
    reasonText?: string;
    utteranceText?: string;
    text?: string;
}

export const RiskAlarmDetailPage = () => {
    const { alarmId } = useParams<{ alarmId: string }>();
    const navigate = useNavigate();
    const location = useLocation() as { state?: { alarm?: AlarmLike } };

    // 목록 → 상세로 올 때 state로 넘겨준 알림이 있으면 그걸 먼저 사용
    const [alarm, setAlarm] = useState<AlarmLike | null>(
        location.state?.alarm ?? null
    );
    const [loading, setLoading] = useState(!location.state?.alarm);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 이미 state로 알림이 들어와 있으면 추가 로딩 X
        if (alarm || !alarmId) return;

        setLoading(true);
        setError(null);

        fetchRiskAlarms()
            .then((list: any[]) => {
                const found = list.find((a) => String(a.alarmId) === alarmId);
                if (!found) {
                    setError("알림 정보를 찾을 수 없습니다.");
                } else {
                    setAlarm(found);
                }
            })
            .catch((err) => {
                console.error("알림 상세 불러오기 실패:", err);
                setError("알림 정보를 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => setLoading(false));
    }, [alarm, alarmId]);

    // 알림 ID 자체가 없는 경우 (URL 이상)
    if (!alarmId) {
        return (
            <AppLayout>
                <div className="text-sm text-slate-400">
                    잘못된 접근입니다. 알림 목록에서 다시 진입해주세요.
                </div>
            </AppLayout>
        );
    }

    // UI에 보여줄 위험도 레벨 계산 (정신/신체 중 더 높은 값)
    const getUiLevel = () => {
        if (!alarm) return 0;

        const mental =
            (alarm.riskLevelMental ?? alarm.mentalLevel ?? 0) as number;
        const physical =
            (alarm.riskLevelPhysical ?? alarm.physicalLevel ?? 0) as number;

        const raw = Math.max(mental, physical);
        return mapRawToUiLevel(raw);
    };

    const uiLevel = getUiLevel();

    // 발화 문장 / 근거 문장 후보
    const utteranceText =
        alarm?.utteranceText ?? alarm?.text ?? "(발화 문장 정보 없음)";
    const reasonText =
        alarm?.reasonText ?? "(근거 문장 정보가 백엔드에서 전달되지 않았습니다.)";

    const createdAtFormatted = alarm ? formatDate(alarm.createdAt) : "";

    return (
        <AppLayout>
            {/* 상단 헤더 */}
            <section className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
                    >
                        <ArrowLeft size={14} />
                        알림 목록으로 돌아가기
                    </button>

                    <div className="text-[11px] text-slate-400">
                        알림 ID : {alarmId}
                    </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="text-lg font-semibold text-slate-50">
                            {alarm?.userName ?? "알 수 없는 사용자"}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                            생성 시각: {createdAtFormatted || "정보 없음"}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                        <div className="text-xs text-slate-400">
                            이 알림의 위험도 등급
                        </div>
                        <LevelBadge level={uiLevel} />
                        {alarm?.userId && (
                            <button
                                onClick={() =>
                                    navigate(`/users/${alarm.userId}`)
                                }
                                className="mt-1 inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                            >
                                해당 사용자 상세 보기
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* 본문: 발화 내용 + 근거 문장 */}
            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
                {loading && (
                    <div className="text-sm text-slate-400">
                        알림 정보를 불러오는 중입니다...
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && alarm && (
                    <div className="space-y-4">
                        {/* 발화 문장 */}
                        <div>
                            <h2 className="mb-1 text-sm font-semibold text-slate-50">
                                발화 내용
                            </h2>
                            <p className="rounded-2xl bg-slate-950/80 px-4 py-3 text-sm text-slate-100">
                                {utteranceText}
                            </p>
                        </div>

                        {/* 근거 문장 */}
                        <div>
                            <h2 className="mb-1 text-sm font-semibold text-slate-50">
                                모델 판단 근거 문장
                            </h2>
                            <p className="rounded-2xl bg-slate-950/80 px-4 py-3 text-xs text-slate-200 leading-relaxed">
                                {reasonText}
                            </p>
                        </div>

                        {/* 메타 정보 (생성 시각 등) */}
                        <div className="mt-2 grid gap-2 text-[11px] text-slate-400 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2">
                                <div className="mb-1 font-semibold text-slate-300">
                                    알림 생성 시각
                                </div>
                                <div>{createdAtFormatted || "정보 없음"}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2">
                                <div className="mb-1 font-semibold text-slate-300">
                                    사용자 ID
                                </div>
                                <div>{alarm.userId ?? "정보 없음"}</div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </AppLayout>
    );
};
