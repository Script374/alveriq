"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  image: string;
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

// Add more slides here anytime — dots and autoplay adjust automatically.
// NOTE: hero-oversized.jpg and hero-sale.jpg need to be added to
// /public/images/hero/ — until then, point them at hero-men.jpg.
const SLIDES: Slide[] = [
  {
    image: "/images/hero/hero-men.jpg",
    eyebrow: "ALVERIQ — NEW COLLECTION",
    headingLine1: "Elevate Your",
    headingLine2: "Everyday Style.",
    description:
      "Refined essentials designed for everyday confidence. Modern silhouettes, considered details and timeless style.",
    primaryCta: { label: "Shop Collection", href: "/shop" },
    secondaryCta: { label: "New Arrivals", href: "/shop?new=true" },
  },
  {
    image: "/images/hero/hero-oversized.png",
    eyebrow: "OVERSIZED FIT",
    headingLine1: "Comfort Meets",
    headingLine2: "Bold Style.",
    description:
      "Relaxed silhouettes built for movement — the oversized edit made for everyday wear.",
    primaryCta: {
      label: "Shop Oversized",
      href: "/shop?category=Oversized",
    },
    secondaryCta: { label: "View All", href: "/shop" },
  },
  {
    image: "/images/hero/hero-sale.png",
    eyebrow: "LIMITED TIME",
    headingLine1: "Season's Best",
    headingLine2: "Now On Sale.",
    description:
      "Handpicked essentials at their best prices — while stock lasts.",
    primaryCta: { label: "Shop Sale", href: "/shop?category=Sale" },
    secondaryCta: { label: "Explore", href: "/shop" },
  },
];

const AUTOPLAY_MS = 5000;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[activeIndex];

  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#14120F]">

      {/* Slide images — cross-fade between slides */}
      {SLIDES.map((s, index) => (
        <div
          key={s.image}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={`${s.headingLine1} ${s.headingLine2}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-[58%_center] sm:object-center"
          />
        </div>
      ))}

      {/* Image overlays */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[78vh] items-center">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-2xl text-white">

            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/75 sm:text-xs sm:tracking-[0.4em]">
              {slide.eyebrow}
            </p>

            <h1 className="max-w-[760px] font-display text-[2.8rem] font-medium leading-[0.98] tracking-[-0.025em] !text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              {slide.headingLine1}
              <br />
              {slide.headingLine2}
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 sm:mt-7 sm:text-base sm:leading-7 lg:text-lg">
              {slide.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link
                href={slide.primaryCta.href}
                className="btn btn-primary min-h-12 px-6 text-center"
              >
                {slide.primaryCta.label}
              </Link>

              <Link
                href={slide.secondaryCta.href}
                className="btn min-h-12 border border-white/60 bg-white/5 px-6 text-center text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[var(--foreground)]"
              >
                {slide.secondaryCta.label}
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/60 sm:mt-10 sm:gap-x-6 sm:text-[10px] sm:tracking-[0.18em]">
              <span>Premium Quality</span>
              <span aria-hidden="true" className="hidden h-1 w-1 bg-white/40 sm:block" />
              <span>Secure Checkout</span>
              <span aria-hidden="true" className="hidden h-1 w-1 bg-white/40 sm:block" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2 sm:bottom-8">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-6 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#14120F]/50 to-transparent" />
    </section>
  );
}