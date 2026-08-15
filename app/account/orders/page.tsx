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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/orders/my", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        console.log("MY ORDERS RESPONSE:", data);

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch your orders"
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("My Orders Error:", error);

        setOrders([]);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-500">
            Loading your orders...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* HEADER */}

        <div className="mb-12">
          <h1 className="text-4xl font-bold md:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 text-gray-500">
            View and track all your ALVERIQ orders.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* NO ORDERS */}

        {orders.length === 0 && !error ? (
          <div className="rounded-3xl border bg-white p-12 text-center">
            <div className="text-6xl">
              📦
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No Orders Yet
            </h2>

            <p className="mt-3 text-gray-500">
              You haven't placed any orders yet.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:opacity-80"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border bg-white p-6 shadow-sm md:p-8"
              >
                {/* ORDER HEADER */}

                <div className="flex flex-col justify-between gap-5 border-b pb-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-semibold">
                      {order.orderId}
                    </p>

                    {order.createdAt && (
                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="text-xl font-bold">
                      ₹{Number(order.total || 0)}
                    </span>
                  </div>
                </div>

                {/* PRODUCTS */}

                <div className="mt-6 space-y-4">
                  {order.items &&
                  order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex gap-4 border-b pb-4 last:border-b-0"
                      >
                        {/* IMAGE */}

                        <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
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
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* DETAILS */}

                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {item.name ||
                              "Product"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>

                          {item.size && (
                            <p className="mt-1 text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          )}

                          {item.price !==
                            undefined && (
                            <p className="mt-1 font-semibold">
                              ₹{item.price}
                            </p>
                          )}
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="font-semibold">
                          ₹
                          {Number(
                            item.price || 0
                          ) *
                            Number(
                              item.quantity || 0
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No products found.
                    </p>
                  )}
                </div>

                {/* DELIVERY */}

                <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm font-semibold">
                    Delivery Address
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    {order.address}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
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

                {/* VIEW ORDER */}

                <div className="mt-6">
                  <Link
                    href={`/order-success?orderId=${encodeURIComponent(
                      order.orderId
                    )}`}
                    className="inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-80"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}