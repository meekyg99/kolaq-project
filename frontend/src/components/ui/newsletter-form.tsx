'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Loader2, Sparkles, Gift } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'footer' | 'standalone';
  showBenefits?: boolean;
}

export function NewsletterForm({ variant = 'footer', showBenefits = false }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Simulate API call (replace with actual newsletter API)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate success
      setStatus('success');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const benefits = [
    { icon: Gift, text: "Exclusive discounts & early access" },
    { icon: Sparkles, text: "New product announcements" },
  ];

  if (variant === 'standalone') {
    return (
      <div className="w-full max-w-xl mx-auto">
        {showBenefits && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4 mb-6"
          >
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <benefit.icon className="w-4 h-4 text-[var(--accent-green)]" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center gap-3 rounded-2xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 p-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckCircle className="w-8 h-8 text-[var(--accent-green)]" />
                </motion.div>
                <div>
                  <p className="font-semibold text-slate-900">You're subscribed!</p>
                  <p className="text-sm text-slate-600">Watch your inbox for exclusive updates.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border-2 transition-all duration-300 ${
                  isFocused 
                    ? 'border-[var(--accent-green)] bg-white shadow-lg shadow-[var(--accent-green)]/10' 
                    : 'border-slate-200 bg-white/80'
                } ${status === 'error' ? 'border-red-300' : ''}`}
              >
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Mail className={`w-5 h-5 transition-colors ${isFocused ? 'text-[var(--accent-green)]' : 'text-slate-400'}`} />
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    disabled={status === 'loading'}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-green)] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[var(--accent-green)]/25 transition-all hover:bg-[var(--accent-green-hover)] hover:shadow-[var(--accent-green)]/40 disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Error Message */}
          <AnimatePresence>
            {status === 'error' && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-8 left-0 flex items-center gap-2 text-sm text-red-500"
              >
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    );
  }

  // Footer variant (compact)
  return (
    <form onSubmit={handleSubmit} className="mt-2 w-full max-w-sm">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 px-4 py-3"
          >
            <CheckCircle className="w-5 h-5 text-[var(--accent-green)]" />
            <span className="text-sm font-medium text-slate-700">Subscribed!</span>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div 
              className={`flex items-center gap-2 rounded-full border bg-white/60 px-2 py-1 transition-all duration-300 ${
                isFocused 
                  ? 'border-[var(--accent-green)] ring-2 ring-[var(--accent-green)]/20' 
                  : 'border-slate-200'
              } ${status === 'error' ? 'border-red-300' : ''}`}
            >
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                isFocused ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]' : 'bg-slate-100 text-slate-500'
              }`}>
                <Mail size={16} />
              </span>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                placeholder="Email address"
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                disabled={status === 'loading'}
              />
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent-green)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-md shadow-[var(--accent-green)]/20 transition hover:bg-[var(--accent-green-hover)]"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Join'
                )}
              </motion.button>
            </div>
            
            {/* Error Message */}
            <AnimatePresence>
              {status === 'error' && errorMessage && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1.5 text-xs text-red-500 pl-2"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
