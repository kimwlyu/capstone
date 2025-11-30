// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import {
    fetchUsers,
    fetchRiskAlarms,
    createUserUtterance,
    formatDate,
    type RiskAlarm,
    type UserSummary,
    type CreateUtteranceResponse,
} from "@/api/client";
import { Link, useNavigate } from "react-router-dom";
import { Bell, UserCircle2, Users } from "lucide-react";
import { getCombinedUiLevel } from "@/utils/riskLevel";

export const Dashboard = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [alarms, setAlarms] = useState<RiskAlarm[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [utteranceText, setUtteranceText] = useState("");
    const [submitState, setSubmitState] =
        useState<"idle" | "sending" | "done">("idle");

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers().then((data) => {
            setUsers(data);
            if (data.length > 0) setSelectedUserId(data[0].userId);
        });

        fetchRiskAlarms().then((data) => {
            const sorted = [...data].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setAlarms(sorted);
        });
    }, []);

    const latestAlarm = alarms[0];
    const latestFive = alarms.slice(0, 5);

    const handleSubmitUtterance = async () => {
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!selectedUserId) return setErrorMsg("사용자 선택 필요");
        if (!utteranceText.trim()) return setErrorMsg("발화 입력 필요");

        try {
            setSubmitState("sending");

            const res: CreateUtteranceResponse = await createUserUtterance(
                selectedUserId,
                utteranceText.trim()
            );

            setSubmitState("done");
            setUtteranceText("");
            setSuccessMsg(`전송 완료! (utteranceId: ${res.utteranceId})`);
            setTimeout(() => setSubmitState("idle"), 1500);
        } catch (err: any) {
            setSubmitState("idle");
            console.error(err);
            setErrorMsg(
                `서버 오류 ${err.response?.status} : ${JSON.stringify(
                    err.response?.data
                )}`
            );
        }
    };

    // 여기서 level은 "UI 레벨(0~2)"라고 가정
    const renderLevelChip = (level: number) => {
        const safe = Math.max(0, Math.min(2, level ?? 0));
        if (safe === 0) {
            return (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    ● 위험도 0
                </span>
            );
        }
        if (safe === 1) {
            return (
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                    ● 위험도 1
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700">
                ● 위험도 2
            </span>
        );
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* 상단 설명 */}
                <section className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 border border-blue-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>실시간 분석</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        위험도 모니터링 대시보드
                    </h2>
                    <p className="text-sm text-slate-500">
                        등록된 어르신, 위험 알림, 케어봇 발화 테스트를 한 화면에서 확인하고
                        시뮬레이션할 수 있습니다.
                    </p>
                </section>

                {/* 통계 카드 */}
                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <StatCard
                        title="등록 사용자"
                        value={users.length}
                        description="시스템에 등록된 전체 케어 대상자 수"
                        icon={<Users className="h-4 w-4" />}
                        accent="blue"
                    />
                    <StatCard
                        title="전체 위험 알림"
                        value={alarms.length}
                        description="누적 위험 알림 발생 건수"
                        icon={<Bell className="h-4 w-4" />}
                        accent="emerald"
                    />
                    <StatCard
                        title="최근 위험 사용자"
                        value={latestAlarm?.userName ?? "-"}
                        description={
                            latestAlarm
                                ? formatDate(latestAlarm.createdAt)
                                : "아직 최근 알림이 없습니다."
                        }
                        icon={<UserCircle2 className="h-4 w-4" />}
                        accent="slate"
                    />
                </section>

                {/* 메인 2컬럼 영역 */}
                <section className="flex flex-col gap-6 lg:flex-row">
                    {/* 왼쪽 : 등록 사용자 + 발화 테스트 */}
                    <div className="flex flex-1 flex-col gap-6">
                        {/* 등록된 사용자 */}
                        {/* (이 부분은 그대로) */}
                        {/* ... 생략 없이 위에서 준 코드 그대로 유지 ... */}
                        {/* 여기서부터는 네가 준 코드와 동일, 중간 생략 없음 */}

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        등록된 사용자
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        이름을 클릭하면 상세 페이지로 이동합니다.
                                    </p>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    총 {users.length}명
                                </span>
                            </div>

                            <table className="w-full table-fixed text-xs">
                                <thead className="bg-slate-50/80">
                                <tr className="text-slate-500">
                                    <th className="py-2 pl-6 pr-3 text-left font-semibold">
                                        이름
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold">나이</th>
                                    <th className="px-3 py-2 text-left font-semibold">지역</th>
                                    <th className="py-2 pl-3 pr-6 text-right font-semibold">
                                        연락처
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((u, idx) => (
                                    <tr
                                        key={u.userId}
                                        className="border-t border-slate-100 bg-white transition hover:bg-blue-50/60"
                                        style={{
                                            animation: "rowFade_0.25s ease-out",
                                            animationDelay: `${idx * 0.02}s`,
                                            animationFillMode: "backwards",
                                        }}
                                    >
                                        <td className="py-2 pl-6 pr-3">
                                            <Link
                                                to={`/users/${u.userId}`}
                                                className="text-xs font-medium text-blue-700 hover:underline"
                                            >
                                                {u.name}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2 text-slate-700">{u.age}</td>
                                        <td className="px-3 py-2 text-slate-700">
                                            {u.region}
                                        </td>
                                        <td className="py-2 pl-3 pr-6 text-right text-slate-700 tabular-nums">
                                            {u.phone}
                                        </td>
                                    </tr>
                                ))}

                                {users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-6 text-center text-sm text-slate-500"
                                        >
                                            사용자 정보가 없습니다.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* 케어봇 발화 테스트 */}
                        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-slate-900">
                                케어봇 발화 테스트
                            </h3>
                            <p className="text-xs text-slate-500">
                                어르신을 선택하고 발화를 입력하면 백엔드 분석 모델이 실행되어
                                실제 환경처럼 위험 알림이 발생합니다.
                            </p>

                            <div className="flex flex-col gap-3 text-xs">
                                <select
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    value={selectedUserId ?? ""}
                                    onChange={(e) =>
                                        setSelectedUserId(Number(e.target.value))
                                    }
                                >
                                    <option value="" disabled>
                                        사용자를 선택하세요
                                    </option>
                                    {users.map((u) => (
                                        <option key={u.userId} value={u.userId}>
                                            {u.name} (ID {u.userId})
                                        </option>
                                    ))}
                                </select>

                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="예: 힘들어서 죽고 싶어요"
                                    value={utteranceText}
                                    onChange={(e) => setUtteranceText(e.target.value)}
                                />

                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md disabled:opacity-40"
                                        disabled={submitState === "sending"}
                                        onClick={handleSubmitUtterance}
                                    >
                                        {submitState === "sending" ? "전송 중..." : "Send"}
                                    </button>

                                    {successMsg && (
                                        <div className="flex-1 text-right text-[11px] font-medium text-emerald-600">
                                            {successMsg}
                                        </div>
                                    )}
                                    {errorMsg && (
                                        <div className="flex-1 text-right text-[11px] font-medium text-red-600">
                                            {errorMsg}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽 : 최근 위험 알림 프리뷰 */}
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-2">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">
                                    최근 위험 알림
                                </h3>
                                <p className="text-xs text-slate-500">
                                    최근 5개의 알림을 간단히 표시합니다.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/risk-alarms")}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                            >
                                전체 보기
                            </button>
                        </div>

                        <div className="space-y-3">
                            {latestFive.length === 0 && (
                                <div className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
                                    아직 알림이 없습니다.
                                </div>
                            )}

                            {latestFive.map((alarm, idx) => {
                                const uiLevel = getCombinedUiLevel(
                                    alarm.mentalLevel,
                                    alarm.physicalLevel
                                );
                                return (
                                    <button
                                        key={alarm.alarmId}
                                        type="button"
                                        onClick={() =>
                                            navigate(`/risk-alarms/${alarm.alarmId}`)
                                        }
                                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left shadow-[0_0_0_1px_rgba(148,163,184,0.12)] transition hover:bg-slate-100"
                                        style={{
                                            animation: "rowFade_0.25s ease-out",
                                            animationDelay: `${idx * 0.02}s`,
                                            animationFillMode: "backwards",
                                        }}
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="text-sm font-semibold text-slate-900">
                                                {alarm.userName}
                                            </div>
                                            {renderLevelChip(uiLevel)}
                                        </div>
                                        <div className="mb-1 text-[11px] text-slate-500">
                                            {formatDate(alarm.createdAt)}
                                        </div>
                                        <div className="line-clamp-2 text-xs text-slate-700">
                                            {alarm.reasonText}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <style>{`
        @keyframes rowFade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
            </div>
        </AppLayout>
    );
};
