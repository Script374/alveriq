"use client";

import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/context/CartContext";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* ================= OVERLAY ================= */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ================= DRAWER ================= */}

      <aside
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-md transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
          <div>
            <p className="eyebrow">
              ALVERIQ
            </p>

            <h2 className="mt-1 text-2xl">
              Shopping Cart
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 transition hover:bg-[var(--surface-sunken)]"
          >
            <X size={21} />
          </button>
        </div>

        {/* ================= CART ITEMS ================= */}

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-medium text-[var(--foreground)]">
                Your cart is empty.
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Add something from the ALVERIQ collection.
              </p>

              <Link
                href="/shop"
                onClick={onClose}
                className="btn btn-primary mt-6"
              >
                Explore Collection
                <span aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size || "no-size"}`}
                  className="flex gap-4 border-b border-[var(--border)] pb-5"
                >
                  {/* ================= IMAGE ================= */}

                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[var(--surface-sunken)]" />
                    )}
                  </div>

                  {/* ================= DETAILS ================= */}

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="truncate font-medium text-[var(--foreground)]">
                      {item.name}
                    </h3>

                    {/* SIZE */}

                    {item.size && (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Size:{" "}
                        <span className="font-mono font-medium text-[var(--foreground)]">
                          {item.size}
                        </span>
                      </p>
                    )}

                    {/* PRICE */}

                    <p className="mt-1 font-mono text-lg font-medium text-[var(--foreground)]">
                      ₹{item.price}
                    </p>

                    {/* ================= QUANTITY ================= */}

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() =>
                          decreaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] p-1.5 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="min-w-5 text-center font-mono text-sm">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() =>
                          increaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] p-1.5 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        <Plus size={15} />
                      </button>

                      {/* REMOVE */}

                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.size
                          )
                        }
                        className="ml-auto rounded-[var(--radius-sm)] p-1.5 text-[var(--accent)] transition hover:bg-[var(--surface-sunken)] hover:text-[var(--accent-hover)]"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        {cart.length > 0 && (
          <div className="border-t border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-medium text-[var(--foreground)]">
                Total
              </span>

              <span className="font-mono text-xl font-medium text-[var(--foreground)]">
                ₹{total}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="btn btn-primary w-full"
            >
              Checkout
              <span aria-hidden="true">
                →
              </span>
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="mt-3 flex w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] transition hover:text-[var(--accent)]"
            >
              View Cart
              <span className="ml-2">
                →
              </span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}