'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PromoBannerProps {
  endDate: Date;
  promoCode?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  linkText?: string;
  storageKey?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const displayValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.div
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-2 min-w-[40px] md:min-w-[50px] text-center"
        >
          <span className="text-xl md:text-2xl font-bold text-white tabular-nums">
            {displayValue}
          </span>
        </motion.div>
      </div>
      <span className="text-[10px] md:text-xs text-white/80 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <div className="flex flex-col justify-center pb-4">
      <motion.span 
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-xl md:text-2xl font-bold text-white"
      >
        :
      </motion.span>
    </div>
  );
}

export function PromoBanner({
  endDate,
  promoCode = "KOLAQ20",
  title = "Black Friday Sale",
  subtitle = "Get 20% off all products",
  link = "/shop",
  linkText = "Shop Now",
  storageKey = "promo-banner-dismissed",
}: PromoBannerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash
  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const now = new Date().getTime();
    const target = endDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, [endDate]);

  // Check localStorage and initialize
  useEffect(() => {
    setIsMounted(true);
    const dismissed = localStorage.getItem(storageKey);
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
    
    // Show again after 24 hours
    if (hoursSinceDismissed > 24) {
      setIsDismissed(false);
    } else if (dismissed) {
      setIsDismissed(true);
    } else {
      setIsDismissed(false);
    }

    const time = calculateTimeLeft();
    if (!time) {
      setIsExpired(true);
    } else {
      setTimeLeft(time);
    }
  }, [storageKey, calculateTimeLeft]);

  // Update countdown every second
  useEffect(() => {
    if (isDismissed || isExpired) return;

    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      if (!time) {
        setIsExpired(true);
        clearInterval(timer);
      } else {
        setTimeLeft(time);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isDismissed, isExpired, calculateTimeLeft]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, Date.now().toString());
    setIsDismissed(true);
  };

  // Don't render on server or if dismissed/expired
  if (!isMounted || isDismissed || isExpired || !timeLeft) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-r from-emerald-600 via-[var(--accent-green)] to-emerald-500 relative">
          {/* Animated background sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  x: [0, Math.random() * 20 - 10],
                  y: [0, Math.random() * 10 - 5],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
              >
                <Sparkles className="w-4 h-4 text-white/30" />
              </motion.div>
            ))}
          </div>

          <div className="container py-3 md:py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left: Title & Subtitle */}
              <div className="flex items-center gap-3 text-center md:text-left">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="hidden md:block"
                >
                  <Gift className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white">
                    {title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/90">
                    {subtitle} • Use code{" "}
                    <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                      {promoCode}
                    </span>
                  </p>
                </div>
              </div>

              {/* Center: Countdown */}
              <div className="flex items-center gap-1 md:gap-2">
                <CountdownDigit value={timeLeft.days} label="Days" />
                <CountdownSeparator />
                <CountdownDigit value={timeLeft.hours} label="Hours" />
                <CountdownSeparator />
                <CountdownDigit value={timeLeft.minutes} label="Mins" />
                <CountdownSeparator />
                <CountdownDigit value={timeLeft.seconds} label="Secs" />
              </div>

              {/* Right: CTA & Close */}
              <div className="flex items-center gap-3">
                <Link
                  href={link}
                  className="bg-white text-emerald-600 px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
                >
                  {linkText}
                </Link>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Pre-configured promo banners for different occasions
export function BlackFridayBanner() {
  // Set end date to December 1, 2025
  const endDate = new Date('2025-12-01T23:59:59');
  
  return (
    <PromoBanner
      endDate={endDate}
      title="🔥 Black Friday Sale"
      subtitle="Get 20% off all products"
      promoCode="BLACKFRIDAY20"
      storageKey="black-friday-2025"
    />
  );
}

export function NewYearBanner() {
  const endDate = new Date('2026-01-01T00:00:00');
  
  return (
    <PromoBanner
      endDate={endDate}
      title="🎉 New Year Sale"
      subtitle="Start 2026 with wellness - 15% off"
      promoCode="NEWYEAR15"
      storageKey="new-year-2026"
    />
  );
}

export function FlashSaleBanner({ hours = 24 }: { hours?: number }) {
  const endDate = new Date(Date.now() + hours * 60 * 60 * 1000);
  
  return (
    <PromoBanner
      endDate={endDate}
      title="⚡ Flash Sale"
      subtitle={`${hours}-hour exclusive deal`}
      promoCode="FLASH25"
      storageKey={`flash-sale-${Date.now()}`}
    />
  );
}
