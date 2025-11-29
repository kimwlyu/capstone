// src/pages/UserUtterancesPage.tsx
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { fetchUserUtterances } from "@/api/client";
import { UserUtterance } from "@/types/types";
import { useParams } from "react-router-dom";

export const UserUtterancesPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const [utterances, setUtterances] = useState<UserUtterance[]>([]);

    useEffect(() => {
        if (!userId) return;
        fetchUserUtterances(Number(userId))
            .then(setUtterances)
            .catch(console.error);
    }, [userId]);

    return (
        <AppLayout>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">사용자 발화 내역</h2>
                <div className="bg-white rounded-2xl shadow p-4">
                    <div className="space-y-2 max-h-[600px] overflow-y-auto text-xs">
                        {utterances.length === 0 && (
                            <div className="text-slate-400">발화 내역이 없습니다.</div>
                        )}
                        {utterances.map((u) => (
                            <div
                                key={u.id}
                                className="border rounded-lg p-2 flex justify-between gap-3"
                            >
                                <div className="flex-1">
                                    <div className="text-[11px] text-slate-400 mb-1">
                                        {new Date(u.createdAt).toLocaleString()}
                                    </div>
                                    <div>{u.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};
