"use client";

import { FormEvent, useState } from "react";

type Order = {
  _id: string;
  orderId: string;

  customerName?: string;
  email?: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  total: number;
  paymentId?: string;

  status: string;
  createdAt?: string;
  updatedAt?: string;
};

const statusDescription: Record<string, string> = {
  Pending:
    "Your order has been received and is waiting for confirmation.",

  Paid:
    "Your payment has been received successfully. Your order is confirmed.",

  Processing:
    "Your order is being prepared and packed for shipment.",

  Shipped:
    "Your order has been shipped and is on its way to you.",

  Delivered:
    "Your order has been delivered successfully. Thank you for shopping with ALVERIQ.",

  Cancelled:
    "This order has been cancelled.",
};

const statusTitle: Record<string, string> = {
  Pending: "Order Placed",
  Paid: "Payment Confirmed",
  Processing: "Preparing Your Order",
  Shipped: "Order Shipped",
  Delivered: "Order Delivered",
  Cancelled: "Order Cancelled",
};

function formatDate(date?: string) {
  if (!date) return "N/A";

  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function maskEmail(email?: string) {
  if (!email) return "N/A";

  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Pending":
      return "○";

    case "Paid":
      return "₹";

    case "Processing":
      return "⚙";

    case "Shipped":
      return "↗";

    case "Delivered":
      return "✓";

    case "Cancelled":
      return "×";

    default:
      return "•";
  }
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setOrder(null);
    setCopied(false);

    const cleanOrderId = orderId.trim();

    if (!cleanOrderId) {
      setError("Please enter your order ID.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(cleanOrderId)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Order not found"
        );
      }

      setOrder(data.order);
    } catch (error) {
      console.error(
        "Track Order Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to find this order."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = async () => {
    if (!order?.orderId) return;

    try {
      await navigator.clipboard.writeText(
        order.orderId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const currentStatus = order?.status || "";
  const isCancelled = currentStatus === "Cancelled";

  // COD orders don't get "Paid" until delivery — payment is collected on arrival
  const isCOD = !!order?.orderId?.toUpperCase().startsWith("COD");

  // Build the timeline steps based on payment method
  const statuses = isCOD
    ? (["Pending", "Processing", "Shipped", "Delivered"] as const)
    : (["Pending", "Paid", "Processing", "Shipped", "Delivered"] as const);

  // For COD, treat "Paid" as functionally equal to "Processing" (paid on delivery)
  const normalizedStatus =
    isCOD && currentStatus === "Paid" ? "Processing" : currentStatus;

  const currentStatusIndex = statuses.indexOf(
    normalizedStatus as any
  );

  const paymentIsDone = isCOD
    ? currentStatus === "Delivered"
    : currentStatus === "Paid" ||
      currentStatus === "Processing" ||
      currentStatus === "Shipped" ||
      currentStatus === "Delivered";

  return (
    <main className="min-h-screen bg-[var(--surface-sunken)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
            ALVERIQ
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Track Your Order
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Enter your order ID to view your latest order status.
          </p>
        </div>

        {/* ========================================
            SEARCH CARD
        ======================================== */}

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8">

          <form
            onSubmit={handleTrackOrder}
            className="space-y-5"
          >

            <div>
              <label
                htmlFor="orderId"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]"
              >
                Order ID
              </label>

              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) =>
                  setOrderId(e.target.value)
                }
                placeholder="COD-25ab41a4-4695..."
                autoComplete="off"
                className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--foreground)]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--foreground)] px-6 py-4 text-sm font-semibold text-[var(--surface)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Checking your order..."
                : "Track Order"}
            </button>

          </form>

          <p className="mt-5 text-center text-xs text-[var(--muted)]">
            Your order information is protected.
          </p>
        </div>

        {/* ========================================
            ORDER RESULT
        ======================================== */}

        {order && (
          <div className="mt-10 space-y-6">

            {/* STATUS SUMMARY */}

            <div
              className={`rounded-3xl border p-6 sm:p-8 ${
                isCancelled
                  ? "border-red-200 bg-red-50"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                    Current Status
                  </p>

                  <h2
                    className={`mt-2 text-3xl font-semibold ${
                      isCancelled
                        ? "text-red-700"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {statusTitle[normalizedStatus] ||
                      currentStatus}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    {statusDescription[normalizedStatus] ||
                      "Your order status has been updated."}
                  </p>
                </div>

                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${
                    isCancelled
                      ? "bg-red-100 text-red-700"
                      : "bg-black text-white"
                  }`}
                >
                  {getStatusIcon(normalizedStatus)}
                </div>

              </div>
            </div>

            {/* ORDER INFORMATION */}

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">

              <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Order ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm font-semibold text-[var(--foreground)]">
                    {order.orderId}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyOrderId}
                  className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-sunken)]"
                >
                  {copied
                    ? "Copied ✓"
                    : "Copy Order ID"}
                </button>

              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                    Customer
                  </p>

                  <p className="mt-1 font-medium text-[var(--foreground)]">
                    {order.customerName || "Customer"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-[var(--foreground)]">
                    {maskEmail(order.email)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                    {formatCurrency(order.total)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                    Ordered
                  </p>

                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

              </div>
            </div>

            {/* ORDER TIMELINE */}

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Order Journey
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  Track your order
                </h2>

                {isCOD && (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Cash on Delivery — payment will be collected at delivery.
                  </p>
                )}
              </div>

              <div className="mt-8">

                {isCancelled ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                        ×
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">
                          Order Cancelled
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-red-700">
                          {statusDescription.Cancelled}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0">

                    {statuses.map((status, index) => {

                      const completed = currentStatusIndex >= index;
                      const current = normalizedStatus === status;
                      const isLast = index === statuses.length - 1;

                      return (
                        <div
                          key={status}
                          className="relative flex gap-4"
                        >

                          {!isLast && (
                            <div
                              className={`absolute left-5 top-10 h-[calc(100%-18px)] w-px ${
                                index < currentStatusIndex
                                  ? "bg-black"
                                  : "bg-[var(--border)]"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              completed
                                ? "bg-black text-white"
                                : "bg-[var(--surface-sunken)] text-[var(--muted)]"
                            } ${
                              current
                                ? "ring-4 ring-black/10"
                                : ""
                            }`}
                          >
                            {completed ? "✓" : index + 1}
                          </div>

                          <div className="min-h-[92px] pb-7">

                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className={`font-semibold ${
                                  completed
                                    ? "text-[var(--foreground)]"
                                    : "text-[var(--muted)]"
                                }`}
                              >
                                {statusTitle[status]}
                              </h3>

                              {current && (
                                <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                  Current
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-1 max-w-xl text-sm leading-6 ${
                                completed
                                  ? "text-[var(--muted)]"
                                  : "text-[var(--muted)]/70"
                              }`}
                            >
                              {statusDescription[status]}
                            </p>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>
            </div>

            {/* SHIPPING DETAILS */}

            <div className="grid gap-6 lg:grid-cols-2">

              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Delivery Address
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  Shipping details
                </h2>

                <div className="mt-6 space-y-2 text-sm text-[var(--foreground)]">

                  <p className="font-medium">
                    {order.customerName || "Customer"}
                  </p>

                  {order.address && <p>{order.address}</p>}

                  {(order.city || order.state || order.pincode) && (
                    <p className="text-[var(--muted)]">
                      {order.city || ""}
                      {order.city && order.state ? ", " : ""}
                      {order.state || ""}
                      {order.pincode ? ` - ${order.pincode}` : ""}
                    </p>
                  )}

                  {order.phone && (
                    <p className="pt-2 text-[var(--muted)]">
                      {order.phone}
                    </p>
                  )}

                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Payment
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  Payment information
                </h2>

                <div className="mt-6 space-y-5">

                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      Payment Method
                    </p>
                    <p className="mt-1 font-semibold text-[var(--foreground)]">
                      {isCOD ? "Cash on Delivery" : "Online Payment"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      Payment Status
                    </p>

                    <p
                      className={`mt-1 font-semibold ${
                        currentStatus === "Cancelled"
                          ? "text-red-700"
                          : paymentIsDone
                          ? "text-green-700"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {currentStatus === "Cancelled"
                        ? "Cancelled"
                        : paymentIsDone
                        ? "Paid"
                        : isCOD
                        ? "Pay on Delivery"
                        : "Pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      Payment ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
                      {order.paymentId || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--muted)]">
                      Order Total
                    </p>

                    <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* FOOTER MESSAGE */}

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">

              <p className="text-sm font-medium text-[var(--foreground)]">
                Need help with your order?
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Please contact ALVERIQ customer support with your order ID.
              </p>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}