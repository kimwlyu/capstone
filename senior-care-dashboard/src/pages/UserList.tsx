// src/pages/UserList.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { fetchUsers, type UserSummary } from "@/api/client";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Users as UsersIcon } from "lucide-react";

export const UserList = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchUsers()
            .then((data) => setUsers(data))
            .catch((err) => {
                console.error(err);
                setError("사용자 목록을 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter((u) => {
        if (!keyword.trim()) return true;
        const q = keyword.toLowerCase();
        return (
            u.name.toLowerCase().includes(q) ||
            u.region.toLowerCase().includes(q) ||
            u.phone.toLowerCase().includes(q)
        );
    });

    // 이름 첫 글자 이니셜
    const getInitial = (name: string) => name.trim().charAt(0) || "?";

    return (
        <AppLayout>
            {/* 상단 설명 */}
            <section className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 border border-blue-100">
                    <UsersIcon size={14} />
                    <span>케어 대상자 관리</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                    케어 대상자 목록
                </h2>
                <p className="text-sm text-slate-500">
                    발화 분석 시스템에 등록된 어르신 정보입니다. 행을 클릭하면 해당
                    어르신의 상세 위험도 이력과 발화 내용을 확인할 수 있습니다.
                </p>
            </section>

            {/* 검색 + 요약 */}
            <section className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex h-6 items-center rounded-full bg-blue-50 px-2 text-[11px] font-medium text-blue-700 border border-blue-100">
            총 {users.length}명 등록
          </span>
                    {filtered.length !== users.length && (
                        <span className="text-[11px]">
              필터 적용: {filtered.length}명 표시 중
            </span>
                    )}
                </div>

                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="이름, 지역, 연락처로 검색"
                        className="h-9 w-72 rounded-full border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </section>

            {/* 테이블 카드 */}
            <section className="mt-5">
                {/* 그라데이션 보더 + 안쪽 카드 */}
                <div className="relative rounded-3xl bg-gradient-to-r from-blue-100 via-slate-100 to-emerald-100 p-[1px] shadow-sm">
                    <div className="overflow-hidden rounded-[22px] bg-white">
                        {/* 헤더 */}
                        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-3 text-xs font-semibold text-slate-500">
                            <div className="grid grid-cols-[1.5fr_0.5fr_1.7fr_1.3fr] items-center">
                                <div>이름</div>
                                <div className="text-center">나이</div>
                                <div>지역</div>
                                <div className="text-right">연락처</div>
                            </div>
                        </div>

                        {/* 내용 */}
                        {loading ? (
                            <div className="flex items-center justify-center px-6 py-10 text-sm text-slate-500">
                                데이터를 불러오는 중입니다…
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center px-6 py-10 text-sm text-red-500">
                                {error}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex items-center justify-center px-6 py-10 text-sm text-slate-500">
                                조건에 맞는 사용자가 없습니다.
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {filtered.map((u, idx) => (
                                    <li
                                        key={u.userId}
                                        className="group cursor-pointer bg-white transition-all hover:bg-blue-50/80"
                                        onClick={() => navigate(`/users/${u.userId}`)}
                                        style={{
                                            animation: "rowFadeSlide 0.3s ease-out",
                                            animationDelay: `${idx * 0.03}s`,
                                            animationFillMode: "backwards",
                                        }}
                                    >
                                        <div className="grid grid-cols-[1.5fr_0.5fr_1.7fr_1.3fr] items-center px-6 py-3 text-sm">
                                            {/* 이름 + 이니셜 */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-500 transition-all">
                                                    {getInitial(u.name)}
                                                </div>
                                                <div className="flex items-center gap-1">
                          <span className="text-slate-900 group-hover:text-blue-700 underline-offset-2 group-hover:underline">
                            {u.name}
                          </span>
                                                    <ChevronRight
                                                        size={14}
                                                        className="text-slate-300 opacity-0 transition group-hover:opacity-100 group-hover:text-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* 나이 */}
                                            <div className="text-center text-slate-700">
                                                {u.age}
                                            </div>

                                            {/* 지역 */}
                                            <div className="text-slate-700">{u.region}</div>

                                            {/* 연락처 */}
                                            <div className="text-right text-slate-700 tabular-nums">
                                                {u.phone}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 이 페이지에서만 쓰는 애니메이션 정의 */}
                <style>{`
          @keyframes rowFadeSlide {
            0% { opacity: 0; transform: translateY(6px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
            </section>
        </AppLayout>
    );
};
