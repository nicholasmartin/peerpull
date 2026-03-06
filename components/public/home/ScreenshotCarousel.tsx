"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ScreenshotCarouselProps {
  images: { src: string; alt: string }[];
}

export function ScreenshotCarousel({ images }: ScreenshotCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  if (images.length === 0) return null;

  // For 3 images, we show prev / active / next in a 3D-ish arc
  const getSlideStyle = (index: number) => {
    const total = images.length;
    const diff = ((index - activeIndex + total) % total);

    // Center slide
    if (diff === 0) {
      return {
        transform: "translateX(0) scale(1) rotateY(0deg)",
        zIndex: 30,
        opacity: 1,
        filter: "brightness(1)",
      };
    }

    // Right slide (next)
    if (diff === 1 || (diff === total - 2 && total > 3)) {
      return {
        transform: "translateX(55%) scale(0.78) rotateY(-18deg)",
        zIndex: 20,
        opacity: 0.7,
        filter: "brightness(0.6)",
      };
    }

    // Left slide (prev)
    if (diff === total - 1 || (diff === 2 && total > 3)) {
      return {
        transform: "translateX(-55%) scale(0.78) rotateY(18deg)",
        zIndex: 20,
        opacity: 0.7,
        filter: "brightness(0.6)",
      };
    }

    // Hidden
    return {
      transform: "translateX(0) scale(0.5) rotateY(0deg)",
      zIndex: 0,
      opacity: 0,
      filter: "brightness(0.4)",
    };
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className="relative mx-auto"
        style={{ perspective: "1200px", perspectiveOrigin: "center" }}
      >
        {/* Carousel track - capped at ~1/3 viewport height */}
        <div className="relative w-full max-h-[33vh]" style={{ aspectRatio: "2.4/1" }}>
          {images.map((img, i) => {
            const style = getSlideStyle(i);
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="absolute inset-0 transition-all duration-500 ease-in-out cursor-pointer"
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden border border-dark-border/50 shadow-2xl shadow-black/40">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 95vw, 1200px"
                    quality={95}
                    priority={i === 0}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-blue-primary w-6"
                  : "bg-dark-border hover:bg-dark-text-muted"
              }`}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
