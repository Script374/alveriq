"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";

type Product = {
  _id: string;
  id?: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  hoverImage?: string;
  images?: string[];
  category?: string;
  sizes?: string[];
  rating?: number;
  discount?: string;
  description?: string;
  createdAt?: string;
};

export default function NewArrival() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          const latestProducts = [...(data.products || [])]
            .sort((a, b) => {
              const dateA = a.createdAt
                ? new Date(a.createdAt).getTime()
                : 0;

              const dateB = b.createdAt
                ? new Date(b.createdAt).getTime()
                : 0;

              return dateB - dateA;
            })
            .slice(0, 4);

          setProducts(latestProducts);
        }
      } catch (error) {
        console.error("New arrivals fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="bg-[var(--background)] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
          <div className="max-w-2xl">
            <p className="eyebrow">
              Just Dropped
            </p>

            <h2 className="mt-3">
              New Arrivals
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Discover the latest additions to the ALVERIQ collection.
            </p>
          </div>

          <Link
            href="/shop?new=true"
            className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent)] sm:inline-flex"
          >
            View New Arrivals
            <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse"
              >
                <div className="aspect-[3/4] w-full rounded-[var(--radius-md)] bg-[var(--border)]" />

                <div className="mt-4 h-4 w-3/4 rounded bg-[var(--border)]" />

                <div className="mt-3 h-4 w-1/3 rounded bg-[var(--border)]" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card px-6 py-12 text-center sm:py-14">
            <p className="text-sm text-[var(--muted)]">
              No new arrivals available.
            </p>

            <Link
              href="/shop?new=true"
              className="btn btn-secondary mt-6"
            >
              Browse New Arrivals
            </Link>
          </div>
        ) : (
          <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  id: product.id || product._id,
                }}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-10 border-t border-[var(--border)] pt-7 text-center sm:mt-12 sm:pt-8 lg:mt-14">
          <Link
            href="/shop?new=true"
            className="btn btn-secondary min-h-11 px-5"
          >
            View All New Arrivals
            <span aria-hidden="true">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}