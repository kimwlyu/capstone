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
                setUtterances(data);
            })
            .catch((err) => {
                console.error("발화 목록 불러오기 실패:", err);
            });
    }, [userId]);

    return (
        <AppLayout>
            <section className="space-y-2">
                <h1 className="text-xl font-semibold text-slate-900">
                    사용자 발화 이력 (RAW 데이터)
                </h1>
                <p className="text-sm text-slate-500">
                    백엔드에서 전달되는 원본 발화 데이터를 JSON 형태로 확인할 수 있는
                    디버깅용 화면입니다.
                </p>
            </section>

            <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                {utterances.length === 0 ? (
                    <div className="text-sm text-slate-400">
                        아직 발화 이력이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-3 text-xs">
                        {utterances.map((u, idx) => (
                            <pre
                                key={idx}
                                className="max-h-52 overflow-auto rounded-xl bg-slate-50 p-3"
                            >
                {JSON.stringify(u, null, 2)}
              </pre>
                        ))}
                    </div>
                )}
            </section>
        </AppLayout>
    );
};
