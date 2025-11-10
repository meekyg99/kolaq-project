import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account | Kolaq Alagbo",
};

export default function SignupPage() {
  return (
    <div className="container grid min-h-[75vh] items-center gap-10 py-10 md:grid-cols-2">
      <div className="space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900">
          <ArrowLeft size={16} /> Back home
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">Create your trade account</h1>
        <p className="text-sm text-slate-600">
          Unlock wholesale pricing, concierge fulfillment, and early access to limited Kolaq bottlings tailored for premium hospitality programs.
        </p>
        <div className="hidden rounded-[28px] border border-slate-200 bg-white/60 p-6 shadow-sm md:block">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
            Compliance ready
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Verified accounts receive NAFDAC-compliant labels, export-ready documentation, and custom logistics planning across markets.
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
        <form className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-xs uppercase tracking-[0.35em] text-slate-500">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Ada"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Okafor"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="company" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Company or venue
            </label>
            <input
              id="company"
              type="text"
              placeholder="Lagos Social House"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Business email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@business.com"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+234 902 734 2185"
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
              placeholder="Create a strong password"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Notes for concierge (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Tell us about your programme, average order volume, or compliance requirements."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-3 text-xs text-slate-500">
            <input type="checkbox" required className="mt-1 h-3.5 w-3.5 rounded border border-slate-300 text-[var(--accent)]" />
            I agree to the Kolaq trade terms, data processing policy, and responsible serving guidelines.
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-neutral-800"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Already have an account?{" "}
           <Link href="/login" className="font-semibold uppercase tracking-[0.35em] text-[var(--accent)] transition hover:text-neutral-900">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
