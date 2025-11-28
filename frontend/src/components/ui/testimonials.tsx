'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  highlight?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Chidinma Okonkwo",
    role: "Wellness Coach",
    location: "Lagos, Nigeria",
    avatar: "/images/avatars/avatar-1.jpg",
    rating: 5,
    text: "KOLAQ ALAGBO BITTERS has become an essential part of my morning ritual. The blend is smooth, authentic, and leaves me feeling energized throughout the day. My clients love it too!",
    highlight: "essential part of my morning ritual",
  },
  {
    id: 2,
    name: "Michael Adebayo",
    role: "Restaurant Owner",
    location: "Abuja, Nigeria",
    avatar: "/images/avatars/avatar-2.jpg",
    rating: 5,
    text: "We've been stocking KOLAQ ALAGBO for our premium bar menu. The quality is consistent, and guests always ask about it. It's become a signature offering at our establishment.",
    highlight: "signature offering at our establishment",
  },
  {
    id: 3,
    name: "Amara Eze",
    role: "Health Enthusiast",
    location: "Port Harcourt, Nigeria",
    avatar: "/images/avatars/avatar-3.jpg",
    rating: 5,
    text: "I've tried many herbal bitters, but nothing compares to KOLAQ ALAGBO. The traditional recipe combined with modern bottling makes it perfect for everyday wellness.",
    highlight: "nothing compares to KOLAQ ALAGBO",
  },
  {
    id: 4,
    name: "David Okafor",
    role: "Mixologist",
    location: "London, UK",
    avatar: "/images/avatars/avatar-4.jpg",
    rating: 5,
    text: "As a professional mixologist, I'm always looking for authentic ingredients. KOLAQ ALAGBO adds a unique Nigerian heritage to my cocktails that my customers absolutely love.",
    highlight: "unique Nigerian heritage",
  },
  {
    id: 5,
    name: "Folake Adeyemi",
    role: "Lifestyle Blogger",
    location: "New York, USA",
    avatar: "/images/avatars/avatar-5.jpg",
    rating: 5,
    text: "The packaging is stunning, and the taste is even better. I featured KOLAQ ALAGBO in my wellness series, and my followers have been ordering ever since. Premium quality!",
    highlight: "packaging is stunning, and the taste is even better",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  const currentTestimonial = testimonials[currentIndex];

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
                          i < currentTestimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed">
                    "{currentTestimonial.text.split(currentTestimonial.highlight || '').map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && currentTestimonial.highlight && (
                          <span className="text-[var(--accent-green)] font-semibold">
                            {currentTestimonial.highlight}
                          </span>
                        )}
                      </span>
                    ))}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[var(--accent-green)]/20 to-emerald-100 flex items-center justify-center">
                      {/* Fallback to initials if no avatar */}
                      <span className="text-lg font-semibold text-[var(--accent-green)]">
                        {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{currentTestimonial.name}</p>
                      <p className="text-sm text-slate-500">
                        {currentTestimonial.role} • {currentTestimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
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
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
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
      </div>

      {/* Trust Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-900">500+</p>
          <p className="text-sm text-slate-500">Happy Customers</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-900">4.9</p>
          <p className="text-sm text-slate-500">Average Rating</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-900">12+</p>
          <p className="text-sm text-slate-500">Countries</p>
        </div>
      </div>
    </section>
  );
}
