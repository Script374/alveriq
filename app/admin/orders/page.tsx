"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
};

const statuses = [
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] =
    useState<string | null>(null);

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
        "ADMIN ORDERS RESPONSE:",
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
        "Admin orders fetch error:",
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
  // UPDATE STATUS
  // ========================================

  const updateStatus = async (
    orderId: string,
    status: string
  ) => {
    try {
      setUpdatingOrder(orderId);

      const res = await fetch(
        "/api/orders/status",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            orderId,
            status,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "STATUS UPDATE RESPONSE:",
        data
      );

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Status update failed"
        );
      }

      // ========================================
      // IMPORTANT:
      // Yahan order.orderId compare karna hai,
      // _id nahi.
      // ========================================

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status:
                  data.order?.status ||
                  status,
              }
            : order
        )
      );

      console.log(
        "Status updated:",
        orderId,
        status
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Status update failed"
      );

      // Database se fresh data
      await fetchAdminOrders();
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--surface-sunken)] p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl">
            ALVERIQ — Orders
          </h1>

          <p className="mt-8 text-[var(--muted)]">
            Loading orders...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-[var(--surface-sunken)] p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl">
              ALVERIQ — Orders
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              All customer orders
            </p>
          </div>

          <button
            onClick={fetchAdminOrders}
            className="btn btn-secondary"
          >
            Refresh Orders
          </button>
        </div>

        {/* ORDERS */}

        <div className="space-y-6">

          {orders.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-[var(--muted)]">
                No orders found.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="card p-6"
              >

                {/* HEADER */}

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      Order ID
                    </p>

                    <p className="break-all font-mono font-medium text-[var(--foreground)]">
                      {order.orderId}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div className="flex flex-wrap items-center gap-3">

                    <select
                      value={order.status}
                      disabled={
                        updatingOrder ===
                        order.orderId
                      }
                      onChange={(e) =>
                        updateStatus(
                          order.orderId,
                          e.target.value
                        )
                      }
                      className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {statuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>

                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="btn btn-secondary"
                    >
                      View Details
                    </Link>

                  </div>
                </div>

                {/* CUSTOMER */}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      Customer
                    </p>

                    <p className="font-medium text-[var(--foreground)]">
                      {order.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      Email
                    </p>

                    <p className="break-all text-[var(--foreground)]">
                      {order.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      Phone
                    </p>

                    <p className="text-[var(--foreground)]">
                      {order.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      Total
                    </p>

                    <p className="font-mono text-xl font-medium text-[var(--foreground)]">
                      ₹
                      {Number(
                        order.total || 0
                      )}
                    </p>
                  </div>

                </div>

                {/* ADDRESS */}

                <div className="mt-6 border-t border-[var(--border)] pt-6">

                  <p className="text-sm text-[var(--muted)]">
                    Shipping Address
                  </p>

                  <p className="mt-1 text-[var(--foreground)]">
                    {order.address}
                  </p>

                  {(order.city ||
                    order.state ||
                    order.pincode) && (
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
                  )}

                </div>

                {/* PAYMENT */}

                <div className="mt-6 grid gap-4 border-t border-[var(--border)] pt-6 md:grid-cols-2">

                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      Payment ID
                    </p>

                    <p className="break-all font-mono text-sm text-[var(--foreground)]">
                      {order.paymentId ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      Created
                    </p>

                    <p className="text-sm text-[var(--foreground)]">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "N/A"}
                    </p>
                  </div>

                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </main>
  );
}