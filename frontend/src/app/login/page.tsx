import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | KOLAQ ALAGBO BITTERS",
};

export default function LoginPage() {
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
        <form className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border border-slate-300 text-[var(--accent)]" />
              Remember me
            </label>
            <Link
              href="#"
              className="font-semibold uppercase tracking-[0.35em] text-[var(--accent)] transition hover:text-neutral-900"
            >
              Reset password
            </Link>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-neutral-800"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or continue with
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid gap-3 text-sm">
            <button className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 px-5 py-2.5 text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
              <span className="text-xs uppercase tracking-[0.35em]">Sign in with Google</span>
            </button>
            <button className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-200 px-5 py-2.5 text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
              <span className="text-xs uppercase tracking-[0.35em]">Sign in with Paystack</span>
            </button>
          </div>
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
