"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  items: OrderItem[];
  total: number;
  paymentId?: string;
  orderId: string;
  status: string;
  createdAt?: string;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "Shipped":
      return "bg-blue-100 text-blue-700";

    case "Paid":
      return "bg-green-100 text-green-700";

    case "Processing":
      return "bg-yellow-100 text-yellow-700";

    case "Pending":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/orders/my", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch your orders"
          );
        }

        if (!cancelled) {
          setOrders(
            Array.isArray(data.orders)
              ? data.orders
              : []
          );
        }
      } catch (error) {
        console.error("My Orders Error:", error);

        if (!cancelled) {
          setOrders([]);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load orders"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMyOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] items-center justify-center bg-[var(--background)] px-6">
          <p className="font-mono text-sm uppercase tracking-[0.12em] text-[var(--muted)]">
            Loading your orders...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <>
      <Header />

      <main className="min-h-[70vh] bg-[var(--background)]">
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-20">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div className="mb-12">
            <p className="eyebrow">
              ALVERIQ / Orders
            </p>

            <h1 className="mt-3">
              My Orders
            </h1>

            <p className="mt-4 max-w-2xl text-[var(--muted)]">
              View your previous orders and track
              their current delivery status.
            </p>
          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div className="mb-8 rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <p className="font-semibold">
                Unable to load orders
              </p>

              <p className="mt-1">
                {error}
              </p>

              {error.toLowerCase().includes("login") && (
                <Link
                  href="/login"
                  className="mt-4 inline-block font-medium underline"
                >
                  Login to continue
                </Link>
              )}
            </div>
          )}

          {/* =========================
              EMPTY STATE
          ========================= */}

          {orders.length === 0 && !error ? (
            <div className="card p-10 text-center md:p-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-sunken)] text-3xl">
                📦
              </div>

              <h2 className="mt-6 text-2xl">
                No Orders Yet
              </h2>

              <p className="mt-3 text-[var(--muted)]">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/shop"
                className="btn btn-primary mt-8"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            /* =========================
               ORDERS
            ========================= */

            <div className="space-y-6">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="card overflow-hidden"
                >
                  {/* =====================
                      ORDER HEADER
                  ===================== */}

                  <div className="border-b border-[var(--border)] p-6 md:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                          Order ID
                        </p>

                        <p className="mt-2 break-all font-mono text-sm font-medium text-[var(--foreground)]">
                          {order.orderId}
                        </p>

                        {order.createdAt && (
                          <p className="mt-2 text-sm text-[var(--muted)]">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4 md:justify-end">
                        <span
                          className={`rounded-full px-4 py-2 font-mono text-xs font-medium ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                        <span className="font-mono text-xl font-medium text-[var(--foreground)]">
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =====================
                      PRODUCTS
                  ===================== */}

                  <div className="p-6 md:p-8">
                    <h2 className="text-xl">
                      Ordered Items
                    </h2>

                    <div className="mt-6 divide-y divide-[var(--border)]">
                      {order.items &&
                      order.items.length > 0 ? (
                        order.items.map(
                          (item, index) => (
                            <div
                              key={`${item.id}-${index}`}
                              className="flex gap-4 py-5 first:pt-0 last:pb-0"
                            >
                              {/* IMAGE */}

                              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={
                                      item.name ||
                                      "Product"
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase text-[var(--muted)]">
                                    No Image
                                  </div>
                                )}
                              </div>

                              {/* DETAILS */}

                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-[var(--foreground)]">
                                  {item.name ||
                                    "Product"}
                                </h3>

                                <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                                  <p>
                                    Quantity:{" "}
                                    {item.quantity}
                                  </p>

                                  {item.size && (
                                    <p>
                                      Size:{" "}
                                      {item.size}
                                    </p>
                                  )}

                                  {item.price !==
                                    undefined && (
                                    <p className="font-mono text-[var(--foreground)]">
                                      ₹
                                      {Number(
                                        item.price
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* ITEM TOTAL */}

                              <div className="shrink-0 text-right">
                                <p className="font-mono font-medium text-[var(--foreground)]">
                                  ₹
                                  {(
                                    Number(
                                      item.price || 0
                                    ) *
                                    Number(
                                      item.quantity || 0
                                    )
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <p className="py-5 text-sm text-[var(--muted)]">
                          No products found for this
                          order.
                        </p>
                      )}
                    </div>

                    {/* =====================
                        DELIVERY
                    ===================== */}

                    <div className="mt-8 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                        Delivery Address
                      </p>

                      <p className="mt-2 text-sm text-[var(--foreground)]">
                        {order.address}
                      </p>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {order.city || ""}
                        {order.city &&
                        order.state
                          ? ", "
                          : ""}
                        {order.state || ""}
                        {order.pincode
                          ? ` - ${order.pincode}`
                          : ""}
                      </p>
                    </div>

                    {/* =====================
                        ACTIONS
                    ===================== */}

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href={`/order-success?orderId=${encodeURIComponent(
                          order.orderId
                        )}`}
                        className="btn btn-primary"
                      >
                        View Order
                      </Link>

                      <Link
                        href={`/track-order?orderId=${encodeURIComponent(
                          order.orderId
                        )}`}
                        className="btn btn-secondary"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}