// src/pages/UserUtterancesPage.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { fetchUserUtterances, type UserUtterance } from "@/api/client";
import { useParams } from "react-router-dom";

export const UserUtterancesPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [utterances, setUtterances] = useState<UserUtterance[]>([]);

    useEffect(() => {
        if (!userId) return;
        const id = Number(userId);

        fetchUserUtterances(id)
            .then((data) => {
                // 여기서 data 타입은 UserUtterance[] 로 추론됨
                setUtterances(data);
            })
            .catch((err) => {
                console.error("발화 목록 불러오기 실패:", err);
            });
    }, [userId]);

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="text-lg font-semibold mb-4">사용자 발화 이력</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                    {utterances.length === 0 ? (
                        <div className="text-sm text-slate-400">
                            아직 발화 이력이 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-3 text-xs">
                            {utterances.map((u, idx) => (
                                <pre
                                    key={idx}
                                    className="bg-slate-50 rounded-xl p-2 overflow-x-auto"
                                >
                                    {JSON.stringify(u, null, 2)}
                                </pre>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};
