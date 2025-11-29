// src/pages/UserList.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { fetchUsers, type UserSummary } from "@/api/client";
import { useNavigate } from "react-router-dom";

export const UserList = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers().then(setUsers).catch(console.error);
    }, []);

    return (
        <AppLayout>
            <h2 className="mb-6 text-base font-semibold text-slate-900">
                사용자 목록
            </h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-full table-fixed text-sm">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            이름
                        </th>
                        <th className="w-20 px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            나이
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            지역
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            연락처
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr
                            key={u.userId}
                            className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                            onClick={() => navigate(`/users/${u.userId}`)}
                        >
                            <td className="px-6 py-3 text-sm text-slate-900">{u.name}</td>
                            <td className="px-6 py-3 text-sm text-slate-700">{u.age}</td>
                            <td className="px-6 py-3 text-sm text-slate-700">
                                {u.region}
                            </td>
                            <td className="px-6 py-3 text-sm text-slate-700">
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
        </AppLayout>
    );
};
