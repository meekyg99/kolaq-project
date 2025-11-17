'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, X } from 'lucide-react';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  isDynamic: boolean;
}

export function ProductImageZoom({ src, alt, isDynamic }: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div className="relative flex items-center justify-center rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm group cursor-pointer" onClick={() => setIsZoomed(true)}>
        <Image
          src={src}
          alt={alt}
          width={380}
          height={480}
          className="h-auto w-full max-w-sm drop-shadow-[0_25px_60px_rgba(74,222,128,0.35)]"
          unoptimized={isDynamic}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-[32px] flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
            <ZoomIn className="w-6 h-6 text-slate-700" />
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6 text-slate-900" />
          </button>
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <Image
              src={src}
              alt={alt}
              width={800}
              height={1000}
              className="h-auto w-full max-h-[90vh] object-contain"
              unoptimized={isDynamic}
            />
          </div>
        </div>
      )}
    </>
  );
}
