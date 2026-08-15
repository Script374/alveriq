"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/components/context/CartContext";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 1999 || subtotal === 0
    ? 0
    : 99;

  const total = subtotal + shipping;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[var(--background)]">
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">

          {/* Header */}
          <div className="mb-12 border-b border-[var(--border)] pb-8">
            <p className="eyebrow">
              ALVERIQ
            </p>

            <h1 className="mt-3 text-4xl sm:text-5xl">
              Your Cart
            </h1>

            <p className="mt-4 text-sm text-[var(--muted)]">
              Review your selected pieces before checkout.
            </p>
          </div>

          {/* Empty Cart */}
          {cart.length === 0 ? (
            <div className="card px-6 py-20 text-center">
              <div className="mx-auto max-w-md">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Your cart is empty
                </p>

                <h2 className="mt-4 text-3xl">
                  Nothing here yet.
                </h2>

                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  Discover premium essentials from the
                  ALVERIQ collection and add your favourites
                  to your cart.
                </p>

                <Link
                  href="/shop"
                  className="btn btn-primary mt-8"
                >
                  Explore Collection
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

              {/* Cart Items */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {cart.length}{" "}
                    {cart.length === 1
                      ? "Item"
                      : "Items"}
                  </p>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] transition hover:text-[var(--accent)]"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size || "no-size"}`}
                      className="flex gap-4 py-6 sm:gap-6"
                    >

                      {/* Image */}
                      <Link
                        href={`/product/${item.id}`}
                        className="relative h-32 w-24 shrink-0 overflow-hidden bg-[var(--surface-sunken)] sm:h-40 sm:w-32"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="128px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                            No Image
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex min-w-0 flex-1 flex-col">

                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              href={`/product/${item.id}`}
                              className="text-base font-medium transition hover:text-[var(--accent)] sm:text-lg"
                            >
                              {item.name}
                            </Link>

                            {item.size && (
                              <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                                Size: {item.size}
                              </p>
                            )}
                          </div>

                          <p className="shrink-0 font-mono text-sm font-medium sm:text-base">
                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="mt-auto flex items-end justify-between gap-4 pt-6">

                          {/* Quantity */}
                          <div className="flex items-center border border-[var(--border-strong)]">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center transition hover:bg-[var(--surface-sunken)]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-[var(--border-strong)] font-mono text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center transition hover:bg-[var(--surface-sunken)]"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] transition hover:text-[var(--accent)]"
                          >
                            <Trash2 size={15} />
                            <span className="hidden sm:inline">
                              Remove
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-8">
                  <Link
                    href="/shop"
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:text-[var(--accent)]"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Summary */}
              <aside className="h-fit border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:sticky lg:top-24">

                <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  Order Summary
                </p>

                <h2 className="mt-3 text-2xl">
                  Your Order
                </h2>

                <div className="mt-8 space-y-4">

                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">
                      Subtotal
                    </span>

                    <span className="font-mono">
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">
                      Shipping
                    </span>

                    <span className="font-mono">
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping}`}
                    </span>
                  </div>

                  <hr className="stitch-divider" />

                  <div className="flex justify-between">
                    <span className="font-medium">
                      Total
                    </span>

                    <span className="font-mono text-lg font-medium">
                      ₹
                      {total.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Message */}
                {subtotal > 0 &&
                  subtotal < 1999 && (
                    <div className="mt-6 border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
                      <p className="text-xs leading-5 text-[var(--muted)]">
                        Add ₹
                        {(
                          1999 - subtotal
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        more to unlock free shipping.
                      </p>
                    </div>
                  )}

                {subtotal >= 1999 && (
                  <div className="mt-6 border border-[var(--accent)]/30 bg-[var(--surface-sunken)] p-4">
                    <p className="text-xs text-[var(--accent)]">
                      ✓ You unlocked free shipping.
                    </p>
                  </div>
                )}

                {/* Checkout */}
                <Link
                  href="/checkout"
                  className="btn btn-primary mt-8 w-full"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                <p className="mt-5 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--muted)]">
                  Secure checkout · Easy returns
                </p>
              </aside>

            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}