"use client";

import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      {/* Image placeholder */}
      <div className="relative mb-5 flex h-72 items-center justify-center overflow-hidden rounded-[20px] bg-slate-100">
        <Skeleton className="h-48 w-48 rounded-xl" />
      </div>
      {/* Content */}
      <div className="flex-1 space-y-3 p-5 pt-0">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="mt-4 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-transparent to-transparent">
      <div className="grid h-full w-full grid-cols-2 gap-0">
        <div className="flex h-80 items-center justify-center bg-slate-100">
          <Skeleton className="h-64 w-48 rounded-xl" />
        </div>
        <div className="flex h-80 items-center justify-center bg-slate-50">
          <Skeleton className="h-64 w-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <Skeleton className="h-20 w-20 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function CheckoutSummarySkeleton() {
  return (
    <div className="space-y-5 rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container grid gap-8 py-10 lg:grid-cols-2">
      {/* Image */}
      <div className="flex items-center justify-center rounded-[32px] bg-slate-100 p-8">
        <Skeleton className="h-80 w-64 rounded-xl" />
      </div>
      {/* Details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        <Skeleton className="h-6 w-1/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}
