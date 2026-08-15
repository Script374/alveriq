"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type OrderItem = {
  id: string;
  name?: string;
  image?: string;
  price?: number;
  quantity: number;
  size?: string;
};

type Order = {
  _id: string;
  customerName: string;
  email: string;
  phone: string;

  address: string;
  city?: string;
  state?: string;
  pincode?: string;

  total: number;
  paymentId?: string;
  orderId: string;
  status: string;
  createdAt?: string;

  items?: OrderItem[];
};

const statuses = [
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
];

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      setErrorMessage("Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch(
          `/api/orders/${encodeURIComponent(orderId)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success || !data.order) {
          throw new Error(
            data.message || "Order not found."
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order fetch error:", error);

        setOrder(null);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to fetch order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] items-center justify-center bg-[var(--background)] px-6">
          <p className="font-mono text-sm uppercase tracking-[0.12em] text-[var(--muted)]">
            Loading your order...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  /* ================= ERROR ================= */

  if (!order) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
          <p className="eyebrow">
            Order Lookup
          </p>

          <h1 className="mt-3">
            Order Not Found
          </h1>

          <p className="mt-3 max-w-md text-[var(--muted)]">
            {errorMessage ||
              "We could not find your order."}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/my-orders"
              className="btn btn-primary"
            >
              My Orders
            </Link>

            <Link
              href="/shop"
              className="btn btn-secondary"
            >
              Continue Shopping
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* ================= TRACKING ================= */

  const currentIndex = statuses.indexOf(
    order.status
  );

  return (
    <>
      <Header />

      <main className="mx-auto max-w-5xl bg-[var(--background)] px-6 py-16">
        {/* ================= SUCCESS ================= */}

        <section className="text-center">
          <p className="eyebrow">
            Order Confirmed
          </p>

          <h1 className="mt-3">
            Order Placed Successfully
          </h1>

          <p className="mt-3 text-[var(--muted)]">
            Thank you for shopping with ALVERIQ.
          </p>
        </section>

        {/* ================= SUMMARY ================= */}

        <section className="card mt-12 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Order ID
              </p>

              <p className="mt-2 break-all font-mono text-sm text-[var(--foreground)]">
                {order.orderId}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Status
              </p>

              <div className="mt-2">
                <span className="tag-badge">
                  {order.status}
                </span>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Total
              </p>

              <p className="mt-1 font-mono text-2xl text-[var(--foreground)]">
                ₹{Number(order.total || 0)}
              </p>
            </div>
          </div>
        </section>

        {/* ================= TRACKING ================= */}

        <section className="card mt-8 p-6 md:p-8">
          <h2>Order Tracking</h2>

          <div className="mt-8 space-y-6">
            {statuses.map((status, index) => {
              const completed =
                currentIndex >= index;

              return (
                <div
                  key={status}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] font-mono text-sm ${
                      completed
                        ? "bg-[var(--accent)] text-white"
                        : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted)]"
                    }`}
                  >
                    {completed ? "✓" : index + 1}
                  </div>

                  <div>
                    <p
                      className={`font-medium ${
                        completed
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {status}
                    </p>

                    <p className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                      {completed
                        ? "Completed"
                        : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= DELIVERY ================= */}

        <section className="card mt-8 p-6 md:p-8">
          <h2>Delivery Details</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Name
              </p>

              <p className="mt-1 text-[var(--foreground)]">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Email
              </p>

              <p className="mt-1 text-[var(--foreground)]">
                {order.email}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Phone
              </p>

              <p className="mt-1 text-[var(--foreground)]">
                {order.phone}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Address
              </p>

              <p className="mt-1 text-[var(--foreground)]">
                {order.address}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  City
                </p>

                <p className="mt-1 text-[var(--foreground)]">
                  {order.city || "Not available"}
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  State
                </p>

                <p className="mt-1 text-[var(--foreground)]">
                  {order.state || "Not available"}
                </p>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  Pincode
                </p>

                <p className="mt-1 text-[var(--foreground)]">
                  {order.pincode || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ITEMS ================= */}

        {order.items && order.items.length > 0 && (
          <section className="card mt-8 p-6 md:p-8">
            <h2>Ordered Items</h2>

            <div className="mt-6 space-y-4">
              {order.items.map((item, index) => {
                const itemTotal =
                  Number(item.price || 0) *
                  Number(item.quantity || 0);

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-4 border-b border-[var(--border)] pb-4 last:border-0"
                  >
                    {/* IMAGE */}

                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-sunken)]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-xs text-[var(--muted)]">
                          Item
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--foreground)]">
                        {item.name || "Product"}
                      </p>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Qty: {item.quantity}
                      </p>

                      {item.size && (
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Size: {item.size}
                        </p>
                      )}

                      {item.price !== undefined && (
                        <p className="mt-1 font-mono text-sm text-[var(--muted)]">
                          ₹{Number(item.price)} each
                        </p>
                      )}
                    </div>

                    {/* TOTAL */}

                    <p className="font-mono font-medium text-[var(--foreground)]">
                      ₹{itemTotal}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= BUTTONS ================= */}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/my-orders"
            className="btn btn-primary"
          >
            My Orders
          </Link>

          <Link
            href="/shop"
            className="btn btn-secondary"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="btn btn-secondary"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}