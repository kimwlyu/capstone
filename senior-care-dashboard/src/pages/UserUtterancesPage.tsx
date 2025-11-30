// src/pages/UserUtterancesPage.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
    fetchUserUtterances,
    formatDate,
    type UserUtterance,
} from "@/api/client";
import { useParams } from "react-router-dom";
import { LevelBadge } from "@/components/LevelBadge";
import { mapRawToUiLevel } from "@/utils/riskLevel";

export const UserUtterancesPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [utterances, setUtterances] = useState<UserUtterance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        const id = Number(userId);

        setLoading(true);
        setError(null);

        fetchUserUtterances(id)
            .then((data) => {
                setUtterances(data);
            })
            .catch((err) => {
                console.error("발화 목록 불러오기 실패:", err);
                setError("발화 이력을 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    return (
        <AppLayout>
            {/* 상단 설명 영역 */}
            <section className="mb-6 space-y-2">
                <h1 className="text-xl font-semibold text-slate-900">
                    발화 상세 보기
                </h1>
                <p className="text-sm text-slate-500">
                    선택한 사용자의 발화 이력과 각 발화에 대한 위험도·근거 문장을 한눈에 볼 수 있는 화면입니다.
                </p>
                {userId && (
                    <p className="text-xs text-slate-400">
                        사용자 ID : {userId}
                    </p>
                )}
            </section>

            {/* 본문 카드 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {loading && (
                    <div className="text-sm text-slate-400">
                        발화 이력을 불러오는 중입니다...
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && utterances.length === 0 && (
                    <div className="text-sm text-slate-400">
                        아직 발화 이력이 없습니다.
                    </div>
                )}

                {!loading && !error && utterances.length > 0 && (
                    <div className="space-y-3">
                        {utterances.map((utt) => {
                            // 백엔드 원본 레벨(정신/신체 중 최댓값) → UI 레벨로 변환
                            const rawLevel = Math.max(
                                utt.riskLevelMental,
                                utt.riskLevelPhysical
                            );
                            const uiLevel = mapRawToUiLevel(rawLevel);

                            return (
                                <div
                                    key={utt.utteranceId}
                                    className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-slate-100"
                                >
                                    {/* 상단: 시간 + 위험도 배지 */}
                                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                                        <span>{formatDate(utt.timestamp)}</span>
                                        <LevelBadge level={uiLevel} />
                                    </div>

                                    {/* 발화 문장 */}
                                    <div className="mb-2 text-sm font-medium text-slate-900">
                                        {utt.text}
                                    </div>

                                    {/* 근거 문장 */}
                                    {utt.reasonText && (
                                        <div className="text-xs text-slate-600">
                                            <span className="font-semibold text-slate-700">
                                                근거 문장:&nbsp;
                                            </span>
                                            {utt.reasonText}
                                        </div>
                                    )}

                                    {/* 디버깅용 원본 JSON이 필요하면 아래 주석 해제해서 볼 수 있음 */}
                                    {/*
                                    <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-[10px] text-slate-100">
                                        {JSON.stringify(utt, null, 2)}
                                    </pre>
                                    */}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </AppLayout>
    );
};
