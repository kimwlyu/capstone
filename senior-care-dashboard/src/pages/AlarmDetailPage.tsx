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
                <div className="text-sm text-slate-500">로딩 중...</div>
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
            <div className="mb-4">
                <button
                    className="text-xs text-slate-500 hover:text-slate-700"
                    onClick={() => navigate(-1)}
                >
                    ← 뒤로
                </button>
            </div>

            {/* 상단 카드 */}
            <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <button
                        className="text-lg font-semibold text-slate-900 hover:underline"
                        onClick={() => {
                            // userId 는 없으므로 이름으로만 이동 (실제론 userId 필요)
                            navigate("/users");
                        }}
                    >
                        {userName}
                    </button>
                    <LevelBadge level={level} />
                </div>
                <div className="text-xs text-slate-500">
                    발생 시간: {formatDate(detail.createdAt)}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                    <div className="mr-4">
                        <span className="font-semibold">판단 근거: </span>
                        {detail.reasonText}
                    </div>
                    <div className="text-xs text-slate-500">
                        최고 위험도(3) 알림 횟수:{" "}
                        <span className="font-semibold text-slate-900">
              {highestCount}
            </span>
                    </div>
                </div>
            </section>

            {/* 하단: 발화 리스트(지금은 이 알람 1개만) */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-slate-900">
                    이전 대화 시간 및 리스트
                </h2>
                <div className="space-y-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                            <span>{formatDate(detail.createdAt)}</span>
                            <LevelBadge level={level} />
                        </div>
                        <div className="text-sm text-slate-900">{detail.reasonText}</div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
};
