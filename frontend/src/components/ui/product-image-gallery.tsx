'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  isDynamic?: boolean;
}

export function ProductImageGallery({ images, alt, isDynamic = false }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex] || images[0];

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') setIsZoomed(false);
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, goToNext, goToPrevious]);

  // Handle swipe gestures
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      goToPrevious();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image with Swipe */}
        <div 
          ref={containerRef}
          className="relative flex items-center justify-center rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm group overflow-hidden"
        >
          {/* Navigation Arrows - Desktop */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                disabled={currentIndex === 0}
                className="absolute left-4 z-10 bg-white/90 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                disabled={currentIndex === images.length - 1}
                className="absolute right-4 z-10 bg-white/90 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </>
          )}

          {/* Image Slider */}
          <div 
            className="relative w-full cursor-pointer"
            onClick={() => setIsZoomed(true)}
          >
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
                  opacity: { duration: 0.2 }
                }}
                drag={images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="flex items-center justify-center touch-pan-y"
              >
                <Image
                  src={currentImage}
                  alt={`${alt} - Image ${currentIndex + 1}`}
                  width={380}
                  height={480}
                  className="h-auto w-full max-w-sm drop-shadow-[0_25px_60px_rgba(74,222,128,0.35)] select-none pointer-events-none"
                  unoptimized={isDynamic}
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Zoom Indicator */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
              <ZoomIn className="w-6 h-6 text-slate-700" />
            </div>
          </div>

          {/* Image Counter - Mobile */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full md:hidden">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex justify-center gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'border-[var(--accent-green)] ring-2 ring-[var(--accent-green)]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={isDynamic}
                />
                {index === currentIndex && (
                  <motion.div
                    layoutId="thumbnail-indicator"
                    className="absolute inset-0 border-2 border-[var(--accent-green)] rounded-xl"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dot Indicators for Mobile */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-[var(--accent-green)] w-6'
                    : 'bg-slate-300'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-slate-100 transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>

            {/* Navigation Arrows in Zoom Mode */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                  disabled={currentIndex === 0}
                  className="absolute left-4 bg-white/90 rounded-full p-3 shadow-md disabled:opacity-30 hover:bg-white z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  disabled={currentIndex === images.length - 1}
                  className="absolute right-4 bg-white/90 rounded-full p-3 shadow-md disabled:opacity-30 hover:bg-white z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              </>
            )}

            {/* Zoomed Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
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
                    opacity: { duration: 0.2 }
                  }}
                  drag={images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="touch-pan-y"
                >
                  <Image
                    src={currentImage}
                    alt={`${alt} - Image ${currentIndex + 1}`}
                    width={800}
                    height={1000}
                    className="h-auto w-full max-h-[90vh] object-contain select-none"
                    unoptimized={isDynamic}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Thumbnail Strip in Zoom Mode */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 p-2 rounded-2xl">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); goToIndex(index); }}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex
                        ? 'ring-2 ring-[var(--accent-green)]'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${alt} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={isDynamic}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper to generate gallery images from a single product image
// In a real app, this would come from the API with multiple images
export function generateGalleryImages(mainImage: string): string[] {
  // For now, just return the single image
  // Later this can be extended to support multiple product images from the API
  return [mainImage];
}
