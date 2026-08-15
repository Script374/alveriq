"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Shirts",
    image: "/images/categories/shirts.jpg",
  },
  {
    name: "T-Shirts",
    image: "/images/categories/tshirts.jpg",
  },
  {
    name: "Jeans",
    image: "/images/categories/jeans.jpg",
  },
  {
    name: "Oversized",
    image: "/images/categories/oversized.jpg",
  },
  {
    name: "Co-ords",
    image: "/images/categories/coords.jpg",
  },
  {
    name: "Sale",
    image: "/images/categories/sale.jpg",
  },
];

export default function Categories() {
  return (
    <section className="bg-[var(--background)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-10 sm:mb-12 lg:mb-14">
          <p className="eyebrow">
            Discover
          </p>

          <h2 className="mt-2">
            Shop By Category
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Explore premium collections designed for every style
            and everyday occasion.
          </p>
        </div>

        {/* Category Grid — tight, edge-to-edge, kwabey-style */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${encodeURIComponent(
                category.name
              )}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--surface-sunken)]"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={`${category.name} collection`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />

              {/* Subtle scrim so text stays readable on any photo */}
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

              {/* Content — top-right corner, kwabey-style */}
              <div className="absolute right-0 top-0 p-3 text-right sm:p-4">
                <h3 className="!text-white text-base font-semibold uppercase leading-tight tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] sm:text-lg">
                  {category.name}
                </h3>
              </div>

              {/* Bottom-left CTA — appears on hover, oxblood accent */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 sm:p-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/80 transition-transform duration-300 group-hover:translate-x-1 sm:text-[10px]">
                  Explore
                  <span className="ml-1.5 text-[var(--accent,#7a1f2b)]">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}