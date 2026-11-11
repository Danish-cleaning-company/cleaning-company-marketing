"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ResponsiveImage } from "@/components/ResponsiveImage";

const slides = [
  { href: "/services/restauranter", src: "/images/clean-restaurant.webp", label: "Restauranter" },
  { href: "/services/kontor", src: "/images/clean-office.webp", label: "Kontor" },
  { href: "/services/solarium", src: "/images/solarium.webp", label: "Solarium" },
] as const;

export function InfoCarousel({ city = "Kolding" }: { city?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="info-carousel">
      <div className="carousel-container">
        <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slide) => (
            <div className="info-image" key={slide.href}>
              <Link href={slide.href}>
                <ResponsiveImage
                  src={slide.src}
                  alt={`Rengøring ${city} - Professionel rengøringsservice`}
                  width={900}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className="image-text">{slide.label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
