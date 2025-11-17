"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      
      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Redirect based on user role
      if (response.user.role === 'ADMIN' || response.user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container grid min-h-[70vh] items-center gap-10 py-10 md:grid-cols-2">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back home
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back to KOLAQ ALAGBO BITTERS</h1>
        <p className="text-sm text-slate-600">
          Access your trade dashboard, manage wholesale orders, and keep the bar stocked with the freshest KOLAQ ALAGBO BITTERS releases.
        </p>
        <div className="hidden rounded-[28px] border border-slate-200 bg-white/60 p-6 shadow-sm md:block">
          <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400">Pro tip</h2>
          <p className="mt-3 text-sm text-slate-600">
            One login gives you access to inventory tracking, concierge chat, and exclusive KOLAQ ALAGBO BITTERS drops—all synced with your preferred checkout flow.
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border border-slate-300 text-[var(--accent)]"
                disabled={isLoading}
              />
              Remember me
            </label>
            <Link
              href="/reset-password"
              className="font-semibold uppercase tracking-[0.35em] text-[var(--accent)] transition hover:text-neutral-900"
            >
              Reset password
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <p className="text-xs text-slate-500">
            New to KOLAQ ALAGBO BITTERS?{" "}
            <Link
              href="/signup"
              className="font-semibold uppercase tracking-[0.35em] text-[var(--accent)] transition hover:text-neutral-900"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
