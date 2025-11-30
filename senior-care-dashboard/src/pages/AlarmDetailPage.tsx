// src/pages/AlarmDetailPage.tsx
import AppLayout from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const AlarmDetailPage = () => {
    const navigate = useNavigate();

    return (
        <AppLayout>
            <div className="mb-4 flex items-center justify-between gap-4">
                <button
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-sm hover:bg-slate-800"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={14} />
                    닫기
                </button>
            </div>

            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
                <div className="text-sm text-slate-400 leading-relaxed">
                    개별 알림 상세보기 기능은 사용하지 않습니다.
                    <br />
                    상단 종 알림 목록 또는 사용자 상세 화면에서
                    필요한 정보를 확인해주세요.
                </div>
            </section>
        </AppLayout>
    );
};
