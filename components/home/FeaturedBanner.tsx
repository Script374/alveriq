import Image from "next/image";
import Link from "next/link";

export default function FeaturedBanner() {
  return (
    <section className="bg-[var(--surface-sunken)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative min-h-[500px] overflow-hidden rounded-[var(--radius-lg)] bg-[#14120F] sm:min-h-[540px] lg:min-h-[580px]">

          {/* Image */}
          <Image
            src="/images/hero/hero-men.jpg"
            alt="ALVERIQ premium collection"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[58%_center] sm:object-center"
          />

          {/* Dark overlays */}
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex min-h-[500px] items-end sm:min-h-[540px] lg:min-h-[580px]">
            <div className="w-full max-w-2xl px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">

              {/* Eyebrow */}
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/65 sm:text-[10px] sm:tracking-[0.35em] lg:text-xs lg:tracking-[0.4em]">
                The ALVERIQ Edit
              </p>

              {/* Heading */}
              <h2 className="mt-4 max-w-xl !text-white text-[2.5rem] leading-[0.98] tracking-[-0.025em] sm:text-5xl md:text-6xl lg:text-7xl">
                Made for the
                <br />
                everyday.
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:mt-6 sm:text-base">
                Refined essentials designed around effortless
                confidence, clean silhouettes and timeless style.
              </p>

              {/* CTA */}
              <div className="mt-7 sm:mt-9">
                <Link
                  href="/shop"
                  className="btn btn-primary min-h-12 px-6"
                >
                  Explore Collection
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative label */}
          <div className="absolute right-5 top-5 z-10 hidden border border-white/20 px-4 py-3 sm:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
              ALVERIQ
            </p>

            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
              EST. 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}