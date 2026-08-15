"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = {
  _id: string;

  customerName: string;

  total: number;

  status: string;

  orderId: string;

  createdAt?: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ========================================
  // FETCH ALL ADMIN ORDERS
  // ========================================

  const fetchAdminOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/admin/orders",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      console.log(
        "ADMIN DASHBOARD RESPONSE:",
        data
      );

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch admin orders"
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Dashboard orders error:",
        error
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  // ========================================
  // TOTAL ORDERS
  // ========================================

  const totalOrders =
    orders.length;

  // ========================================
  // PAID ORDERS
  // ========================================

  const paidStatuses = [
    "Paid",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const paidOrders =
    orders.filter((order) =>
      paidStatuses.includes(
        order.status
      )
    ).length;

  // ========================================
  // TOTAL SALES
  // ========================================

  const totalSales =
    orders
      .filter((order) =>
        paidStatuses.includes(
          order.status
        )
      )
      .reduce(
        (total, order) =>
          total +
          Number(
            order.total || 0
          ),
        0
      );

  // ========================================
  // PROCESSING ORDERS
  // ========================================

  const processingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Processing"
    ).length;

  // ========================================
  // RECENT ORDERS
  // ========================================

  const recentOrders =
    orders.slice(0, 5);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">

          <h1 className="text-3xl font-bold">
            ALVERIQ Admin
          </h1>

          <p className="mt-8 text-gray-500">
            Loading dashboard...
          </p>

        </div>
      </main>
    );
  }

  // ========================================
  // DASHBOARD
  // ========================================

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-4xl font-bold">
              ALVERIQ Admin
            </h1>

            <p className="mt-2 text-gray-500">
              Store dashboard overview
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={
                fetchAdminOrders
              }
              className="rounded-full border bg-white px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Refresh
            </button>

            <Link
              href="/admin/orders"
              className="rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:opacity-80"
            >
              View All Orders
            </Link>

          </div>

        </div>

        {/* STATS */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL ORDERS */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-3 text-4xl font-bold">
              {totalOrders}
            </p>

          </div>

          {/* TOTAL SALES */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Sales
            </p>

            <p className="mt-3 text-4xl font-bold">
              ₹
              {totalSales.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          {/* PAID ORDERS */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Paid Orders
            </p>

            <p className="mt-3 text-4xl font-bold">
              {paidOrders}
            </p>

          </div>

          {/* PROCESSING */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Processing
            </p>

            <p className="mt-3 text-4xl font-bold">
              {processingOrders}
            </p>

          </div>

        </div>

        {/* RECENT ORDERS */}

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer orders
              </p>

            </div>

            <Link
              href="/admin/orders"
              className="text-sm font-semibold underline"
            >
              View all
            </Link>

          </div>

          {recentOrders.length ===
          0 ? (
            <div className="rounded-2xl bg-gray-50 p-8 text-center">

              <p className="text-gray-500">
                No orders found.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {recentOrders.map(
                (order) => (
                  <div
                    key={order._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5"
                  >

                    {/* INFO */}

                    <div>

                      <p className="font-semibold">
                        {
                          order.customerName
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          order.orderId
                        }
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )
                          : "N/A"}
                      </p>

                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-4">

                      <div className="text-right">

                        <p className="font-bold">
                          ₹
                          {Number(
                            order.total ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p className="text-sm text-gray-500">
                          {
                            order.status
                          }
                        </p>

                      </div>

                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                      >
                        Details
                      </Link>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}