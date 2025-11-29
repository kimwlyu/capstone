// src/pages/LoginPage.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/api/client";

export const LoginPage = () => {
    const [email, setEmail] = useState("test@email.com");
    const [password, setPassword] = useState("test1234");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await adminLogin(email, password);
            // ★ 토큰 저장 필수
            localStorage.setItem("adminToken", data.token);
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
            setError("로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="mb-2 text-center text-xl font-bold">
                    SeniorCare 관리자 로그인
                </h1>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs text-slate-500">이메일</label>
                        <input
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs text-slate-500">
                            비밀번호
                        </label>
                        <input
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        />
                    </div>
                    {error && (
                        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
};
