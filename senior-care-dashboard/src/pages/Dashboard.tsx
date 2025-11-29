// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import {
    fetchUsers,
    fetchRiskAlarms,
    createUserUtterance,
    type RiskAlarm,
    type UserSummary,
    type CreateUtteranceResponse,
} from "@/api/client";
import { Link } from "react-router-dom";

export const Dashboard = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [alarms, setAlarms] = useState<RiskAlarm[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [utteranceText, setUtteranceText] = useState("");
    const [submitState, setSubmitState] = useState<"idle" | "sending" | "done">(
        "idle"
    );

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

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                    <StatCard title="등록 사용자" value={users.length} />
                    <StatCard title="전체 알림" value={alarms.length} />
                    <StatCard
                        title="최근 위험 사용자"
                        value={latestAlarm?.userName ?? "-"}
                        description={
                            latestAlarm ? new Date(latestAlarm.createdAt).toLocaleString() : "-"
                        }
                    />
                </div>

                {/* 사용자 목록 */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border">
                    <table className="w-full text-xs">
                        <thead>
                        <tr className="text-slate-500 border-b">
                            <th className="py-2 text-left">이름</th>
                            <th>나이</th>
                            <th>지역</th>
                            <th>연락처</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.userId} className="border-b">
                                <td className="py-2">
                                    <Link to={`/users/${u.userId}`} className="text-blue-600">
                                        {u.name}
                                    </Link>
                                </td>
                                <td>{u.age}</td>
                                <td>{u.region}</td>
                                <td>{u.phone}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 케어봇 발화 입력 */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
                    <h2 className="text-sm font-medium">케어봇 발화 테스트</h2>
                    <select
                        className="border rounded-lg p-2 text-xs"
                        value={selectedUserId ?? ""}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    >
                        {users.map((u) => (
                            <option key={u.userId} value={u.userId}>
                                {u.name} (ID {u.userId})
                            </option>
                        ))}
                    </select>

                    <input
                        className="border rounded-lg p-2 w-full text-xs"
                        placeholder="예: 힘들어서 죽고 싶어요"
                        value={utteranceText}
                        onChange={(e) => setUtteranceText(e.target.value)}
                    />

                    <button
                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs rounded-lg disabled:opacity-40"
                        disabled={submitState === "sending"}
                        onClick={handleSubmitUtterance}
                    >
                        {submitState === "sending" ? "전송 중" : "Send"}
                    </button>

                    {successMsg && (
                        <div className="text-emerald-600 text-xs">{successMsg}</div>
                    )}
                    {errorMsg && <div className="text-red-600 text-xs">{errorMsg}</div>}
                </div>
            </div>
        </AppLayout>
    );
};
