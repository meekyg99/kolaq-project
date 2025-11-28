"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface HeroAnimatedProps {
  productImage?: string;
  productName?: string;
}

// Floating leaf particles
const leaves = [
  { id: 1, x: "10%", y: "20%", size: 20, delay: 0, duration: 8 },
  { id: 2, x: "85%", y: "15%", size: 16, delay: 1.5, duration: 7 },
  { id: 3, x: "75%", y: "70%", size: 18, delay: 0.8, duration: 9 },
  { id: 4, x: "15%", y: "75%", size: 14, delay: 2, duration: 6 },
  { id: 5, x: "50%", y: "10%", size: 12, delay: 1, duration: 8.5 },
  { id: 6, x: "90%", y: "50%", size: 15, delay: 0.5, duration: 7.5 },
];

// Floating particles/sparkles
const particles = [
  { id: 1, x: "20%", y: "30%", size: 4, delay: 0, duration: 4 },
  { id: 2, x: "80%", y: "25%", size: 3, delay: 0.5, duration: 5 },
  { id: 3, x: "65%", y: "65%", size: 5, delay: 1, duration: 4.5 },
  { id: 4, x: "30%", y: "70%", size: 3, delay: 1.5, duration: 5.5 },
  { id: 5, x: "45%", y: "20%", size: 4, delay: 0.3, duration: 4 },
  { id: 6, x: "70%", y: "40%", size: 3, delay: 0.8, duration: 5 },
  { id: 7, x: "25%", y: "50%", size: 4, delay: 1.2, duration: 4.5 },
  { id: 8, x: "55%", y: "80%", size: 3, delay: 0.6, duration: 5 },
];

function LeafIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C12 22 12 17 12 12C12 7 12 2 12 2Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

export function HeroAnimated({ productImage = "/images/bottle.png", productName = "KOLAQ ALAGBO" }: HeroAnimatedProps) {
  return (
    <div className="relative min-h-[500px] w-full max-w-5xl overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[var(--accent-green)]/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-slate-200/50 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating leaves */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-[var(--accent-green)]/40"
          style={{ left: leaf.x, top: leaf.y }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <LeafIcon size={leaf.size} />
        </motion.div>
      ))}

      {/* Floating particles/sparkles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[var(--accent-green)]"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center px-6 py-12 text-center">
        {/* Floating bottle */}
        <motion.div
          className="relative mb-8"
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Glow effect behind bottle */}
          <motion.div
            className="absolute inset-0 -z-10 blur-2xl"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="h-full w-full rounded-full bg-[var(--accent-green)]/20" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={productImage}
              alt={productName}
              width={280}
              height={400}
              className="h-auto w-56 drop-shadow-2xl md:w-72"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Premium Herbal
            <span className="block text-[var(--accent-green)]">Excellence</span>
          </h1>
          <p className="mx-auto max-w-md text-sm text-slate-600 md:text-base">
            Crafted from ancient Yoruba recipes, refined for the modern world. 
            Experience wellness reimagined.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <Link
            href="#shop"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-green)] px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--accent-green-hover)] hover:scale-105 hover:shadow-xl"
          >
            <span>Shop Now</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-slate-900">3</p>
            <p className="text-xs uppercase tracking-wider text-slate-500">Generations</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-2xl font-bold text-slate-900">92%</p>
            <p className="text-xs uppercase tracking-wider text-slate-500">Repeat Rate</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-2xl font-bold text-slate-900">12+</p>
            <p className="text-xs uppercase tracking-wider text-slate-500">Countries</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
