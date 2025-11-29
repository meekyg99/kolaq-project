'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
    email: string;
  };
  product?: {
    name: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch top-rated reviews (4+ stars) for testimonials
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/reviews/top-rated?minRating=4&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
          setStats({
            averageRating: data.stats?.averageRating || 0,
            totalReviews: data.stats?.totalReviews || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const goToNext = useCallback(() => {
    if (reviews.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const goToPrevious = useCallback(() => {
    if (reviews.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, reviews.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  // Show empty state if no reviews
  if (!loading && reviews.length === 0) {
    return (
      <section className="container space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonials</span>
          <h2 className="text-3xl font-semibold text-slate-900">Customer Reviews</h2>
        </div>

        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-lg p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-green)]/10 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-[var(--accent-green)]" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Be the First to Review</h3>
            <p className="text-slate-600 max-w-md">
              We&apos;re just getting started! Purchase our premium bitters and share your experience.
              Your feedback helps us serve you better.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <section className="container space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonials</span>
          <h2 className="text-3xl font-semibold text-slate-900">Customer Reviews</h2>
        </div>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-lg p-12">
          <div className="animate-pulse space-y-4">
            <div className="flex gap-1 justify-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-slate-200 rounded" />
              ))}
            </div>
            <div className="h-24 bg-slate-200 rounded-lg" />
            <div className="flex items-center gap-4 justify-center">
              <div className="w-14 h-14 bg-slate-200 rounded-full" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-slate-200 rounded" />
                <div className="w-24 h-3 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentReview = reviews[currentIndex];
  const reviewerInitials = currentReview?.reviewer?.name
    ? currentReview.reviewer.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  return (
    <section className="container space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonials</span>
        <h2 className="text-3xl font-semibold text-slate-900">What Our Customers Say</h2>
      </div>

      {/* Testimonial Carousel */}
      <div 
        className="relative"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Quote Icon */}
                <div className="hidden md:block">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent-green)]/10 flex items-center justify-center">
                    <Quote className="w-8 h-8 text-[var(--accent-green)]" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentReview.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed">
                    &quot;{currentReview.comment}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[var(--accent-green)]/20 to-emerald-100 flex items-center justify-center">
                      <span className="text-lg font-semibold text-[var(--accent-green)]">
                        {reviewerInitials}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{currentReview.reviewer.name}</p>
                      {currentReview.product && (
                        <p className="text-sm text-slate-500">
                          Reviewed: {currentReview.product.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </>
          )}
        </div>

        {/* Dot Indicators */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[var(--accent-green)] w-8'
                    : 'bg-slate-300 w-2 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Real Stats (only show if we have data) */}
      {stats.totalReviews > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4 max-w-md mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</p>
            <p className="text-sm text-slate-500">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{stats.totalReviews}</p>
            <p className="text-sm text-slate-500">Total Reviews</p>
          </div>
        </div>
      )}
    </section>
  );
}
