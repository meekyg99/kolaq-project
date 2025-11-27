"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks";

export function SignupForm() {
  const router = useRouter();
  const { register, error: authError, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [localError, setLocalError] = useState("");

  const error = localError || authError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      // Redirect to shop
      router.push('/shop');
    } catch (err: any) {
      console.error('Signup error:', err);
      setLocalError(err.response?.data?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="container grid min-h-[75vh] items-center gap-10 py-10 md:grid-cols-2">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back home
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">Create your trade account</h1>
        <p className="text-sm text-slate-600">
          Unlock wholesale pricing, concierge fulfillment, and early access to limited KOLAQ ALAGBO BITTERS bottlings tailored for premium hospitality programs.
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
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-xs uppercase tracking-[0.35em] text-slate-500">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Ada"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Okafor"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Phone number (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition focus:border-[var(--accent)] focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold uppercase tracking-[0.35em] text-[var(--accent)] transition hover:text-neutral-900"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
