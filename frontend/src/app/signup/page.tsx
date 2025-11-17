import { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create Account | KOLAQ ALAGBO BITTERS",
};

export default function SignupPage() {
  return <SignupForm />;
}
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
            I agree to the KOLAQ ALAGBO BITTERS trade terms, data processing policy, and responsible serving guidelines.
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
