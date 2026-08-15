"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/components/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  /* ========================================
     EMPTY WISHLIST
  ======================================== */

  if (wishlist.length === 0) {
    return (
      <>
        <Header />

        <main className="min-h-[70vh] bg-[var(--background)]">
          <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center border border-[var(--border-strong)] bg-[var(--surface)]">
              <Heart
                size={28}
                strokeWidth={1.5}
                className="text-[var(--accent)]"
              />
            </div>

            <p className="eyebrow mt-7">
              Your Selection
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl">
              Your Wishlist is Empty
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base">
              Save pieces you love and come back to them
              whenever you're ready.
            </p>

            <Link
              href="/shop"
              className="btn btn-primary mt-8"
            >
              Explore Collection
              <span aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* ========================================
     WISHLIST
  ======================================== */

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[var(--background)]">
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          {/* ================= HEADER ================= */}

          <div className="mb-12 border-b border-[var(--border)] pb-8 sm:mb-14">
            <p className="eyebrow">
              ALVERIQ SELECTION
            </p>

            <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-4xl sm:text-5xl">
                  My Wishlist
                </h1>

                <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                  Pieces you've saved for later.
                </p>
              </div>

              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>
          </div>

          {/* ================= PRODUCTS ================= */}

          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
            {wishlist.map((item) => (
              <article
                key={item.id}
                className="card group overflow-hidden"
              >
                {/* ================= IMAGE ================= */}

                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-sunken)]">
                  <Link href={`/product/${item.id}`}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-[var(--surface-sunken)]" />
                    )}
                  </Link>

                  {/* Wishlist Remove */}

                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from wishlist`}
                    onClick={() =>
                      removeFromWishlist(item.id)
                    }
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:border-[var(--accent)]"
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.7}
                      className="fill-[var(--accent)] text-[var(--accent)]"
                    />
                  </button>
                </div>

                {/* ================= DETAILS ================= */}

                <div className="p-5">
                  <Link
                    href={`/product/${item.id}`}
                    className="block"
                  >
                    <h2 className="text-lg leading-snug transition-colors hover:text-[var(--accent)]">
                      {item.name}
                    </h2>

                    <p className="mt-3 font-mono text-lg font-medium text-[var(--foreground)]">
                      ₹{item.price}
                    </p>
                  </Link>

                  <hr className="stitch-divider my-5" />

                  {/* ================= ACTIONS ================= */}

                  <div className="flex gap-2">
                    <Link
                      href={`/product/${item.id}`}
                      className="btn btn-primary flex-1"
                    >
                      <ShoppingBag size={16} />
                      Select Options
                    </Link>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        removeFromWishlist(item.id)
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-strong)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ================= BOTTOM CTA ================= */}

          <div className="mt-14 border-t border-[var(--border)] pt-8 text-center">
            <Link
              href="/shop"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              Continue Shopping
              <span className="ml-2">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}