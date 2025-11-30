// src/pages/LoginPage.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/api/client";
import { ShieldCheck } from "lucide-react";

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
            // ★ 토큰 저장
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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
            {/* 백그라운드 글로우 */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(129,140,248,0.25),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(52,211,153,0.22),transparent_55%)]" />

            <div className="relative z-10 flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:flex-row md:px-6">
                {/* 왼쪽 소개 */}
                <div className="flex flex-1 flex-col justify-center rounded-3xl border border-slate-800/80 bg-slate-950/80 px-6 py-8 text-slate-100 shadow-[0_26px_70px_rgba(15,23,42,1)]">
                    <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
                        <ShieldCheck className="h-4 w-4" />
                        <span>SeniorCare Admin</span>
                    </div>
                    <h1 className="mb-3 text-2xl font-semibold">
                        독거노인 케어봇 관리자 대시보드
                    </h1>
                    <p className="text-sm text-slate-300">
                        어르신의 발화를 기반으로 정신·신체 위험도를 자동 분석하고, 위급
                        상황을 빠르게 파악할 수 있도록 돕는 관리 시스템입니다. 관리자
                        계정으로 로그인해 실시간 데이터를 확인하세요.
                    </p>
                </div>

                {/* 오른쪽 로그인 카드 */}
                <div className="flex-1">
                    <div className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/95 p-8 shadow-[0_26px_70px_rgba(15,23,42,1)] animate-[loginPop_0.35s_ease-out]">
                        <h2 className="mb-2 text-center text-lg font-semibold text-slate-50">
                            관리자 로그인
                        </h2>
                        <p className="mb-6 text-center text-xs text-slate-400">
                            발급받은 관리자 계정으로 로그인해 주세요.
                        </p>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs text-slate-400">
                                    이메일
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-slate-400">
                                    비밀번호
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                />
                            </div>
                            {error && (
                                <div className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-200">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-sky-400 hover:shadow-[0_18px_40px_rgba(56,189,248,0.7)] disabled:opacity-60"
                            >
                                {loading ? "로그인 중..." : "로그인"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes loginPop {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
};
