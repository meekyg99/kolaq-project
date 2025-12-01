"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Shield } from "lucide-react";
import { useAuth } from "@/lib/hooks";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const error = localError || authError;

  // Redirect if already authenticated as admin
  useEffect(() => {
    const adminRoles = ['admin', 'superadmin', 'super_admin'];
    const userRole = user?.role?.toLowerCase();
    if (isAuthenticated && userRole && adminRoles.includes(userRole)) {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();
    setIsSubmitting(true);

    try {
      await login(email, password);
      
      // Small delay to allow zustand persist to write to localStorage
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get updated user from store after login
      const userStr = localStorage.getItem('auth-storage');
      const authData = userStr ? JSON.parse(userStr) : null;
      const loggedInUser = authData?.state?.user;

      console.log('Logged in user:', loggedInUser); // Debug log

      // Check if user is admin (case-insensitive comparison)
      const adminRoles = ['admin', 'superadmin', 'super_admin'];
      const userRole = loggedInUser?.role?.toLowerCase();
      
      if (userRole && adminRoles.includes(userRole)) {
        router.push('/admin');
      } else {
        setLocalError('Access denied. Admin privileges required.');
        // Clear auth since they're not admin
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLocalError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-2">KOLAQ ALAGBO BITTERS</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-amber-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:border-amber-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
            >
              {isSubmitting || authLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
