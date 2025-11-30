// src/pages/AlarmDetailPage.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
    fetchRiskAlarmDetail,
    fetchRiskAlarms,
    formatDate,
    type RiskAlarm,
} from "@/api/client";
import { LevelBadge } from "@/components/LevelBadge";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const AlarmDetailPage = () => {
    const { alarmId } = useParams<{ alarmId: string }>();
    const [detail, setDetail] = useState<{
        alarmId: number;
        utteranceId: number;
        mentalLevel: number;
        physicalLevel: number;
        reasonText: string;
        createdAt: string;
    } | null>(null);
    const [alarms, setAlarms] = useState<RiskAlarm[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!alarmId) return;
        fetchRiskAlarmDetail(Number(alarmId)).then(setDetail).catch(console.error);
        fetchRiskAlarms().then(setAlarms).catch(console.error);
    }, [alarmId]);

    if (!alarmId || !detail) {
        return (
            <AppLayout>
                <div className="text-sm text-slate-400">로딩 중...</div>
            </AppLayout>
        );
    }

    const current = alarms.find((a) => a.alarmId === Number(alarmId));
    const userName = current?.userName ?? "알 수 없음";
    const level = Math.max(detail.mentalLevel, detail.physicalLevel);

    // 이 사용자의 최고 위험도(3) 알림 횟수
    const highestCount = alarms.filter((a) => {
        const lv = Math.max(a.mentalLevel, a.physicalLevel);
        return lv === 3 && a.userName === userName;
    }).length;

    return (
        <AppLayout>
            {/* 상단 네비 + 타이틀 */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <button
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm hover:bg-slate-800"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={14} />
                    뒤로
                </button>
                <div className="text-[11px] text-slate-400">
                    알림 ID : {detail.alarmId} · 발화 ID : {detail.utteranceId}
                </div>
            </div>

            {/* 상단 카드 */}
            <section className="mb-6 rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)] animate-[fadeUp_0.3s_ease-out]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20 text-red-300">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                위험 알림 상세
                            </div>
                            <button
                                className="mt-1 text-lg font-semibold text-slate-50 hover:underline"
                                onClick={() => navigate("/users")}
                            >
                                {userName}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                        <LevelBadge level={level} />
                        <div className="text-[11px] text-slate-400">
                            발생 시간 : {formatDate(detail.createdAt)}
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex flex-wrap items-start justify-between gap-4 text-sm text-slate-100">
                    <div className="min-w-[220px] flex-1">
                        <div className="mb-1 text-xs font-semibold text-slate-400">
                            판단 근거 문장
                        </div>
                        <p className="rounded-2xl bg-slate-800/80 px-4 py-3 leading-relaxed">
                            {detail.reasonText}
                        </p>
                    </div>
                    <div className="hidden w-px self-stretch bg-slate-800 md:block" />
                    <div className="flex flex-col gap-2 text-xs text-slate-300">
                        <div>
                            최고 위험도(3) 알림 횟수{" "}
                            <span className="ml-1 inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-900">
                {highestCount}회
              </span>
                        </div>
                        <div>
                            해당 어르신이 최고 등급(3)으로 분류된 알림의 누적 횟수입니다.
                        </div>
                    </div>
                </div>
            </section>

            {/* 하단: 발화 리스트(지금은 이 알람 1개만) */}
            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)] animate-[fadeUp_0.35s_ease-out]">
                <h2 className="mb-2 text-sm font-semibold text-slate-50">
                    이전 대화 시간 및 리스트
                </h2>
                <p className="mb-4 text-xs text-slate-400">
                    알림을 발생시킨 발화와 그 시점을 다시 확인할 수 있습니다.
                </p>
                <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition hover:bg-slate-900/90">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                            <span>{formatDate(detail.createdAt)}</span>
                            <LevelBadge level={level} />
                        </div>
                        <div className="text-sm text-slate-100">{detail.reasonText}</div>
                    </div>
                </div>
            </section>

            <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </AppLayout>
    );
};
