import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function getStatusClass(status: string) {
  switch (status) {
    case "Paid":
      return "bg-green-50 text-green-700 border border-green-200";

    case "Processing":
      return "bg-amber-50 text-amber-700 border border-amber-200";

    case "Shipped":
      return "bg-blue-50 text-blue-700 border border-blue-200";

    case "Delivered":
      return "bg-green-50 text-green-700 border border-green-200";

    case "Cancelled":
      return "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30";

    default:
      return "bg-[var(--surface-sunken)] text-[var(--muted)] border border-[var(--border)]";
  }
}

export default async function OrderDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  await connectDB();

  // Admin detail page _id se order find karega
  const order = await Order.findById(id).lean();

  if (!order) {
    console.error("ADMIN ORDER NOT FOUND:", id);
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--surface-sunken)] p-8">
      <div className="mx-auto max-w-5xl">

        {/* BACK */}
        <Link
          href="/admin/orders"
          className="mb-6 inline-block text-sm font-medium text-[var(--muted)] transition hover:text-[var(--accent)] hover:underline"
        >
          ← Back to Orders
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl">
              Order Details
            </h1>

            <p className="mt-2 font-mono text-sm text-[var(--muted)]">
              Order ID: {order.orderId}
            </p>
          </div>

          <span
            className={`rounded-[var(--radius-sm)] px-5 py-2 font-mono text-xs uppercase tracking-[0.08em] ${getStatusClass(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        {/* CUSTOMER DETAILS */}
        <section className="card mb-6 p-6">
          <h2 className="mb-5 text-2xl">
            Customer Details
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-[var(--muted)]">
                Name
              </p>

              <p className="font-medium text-[var(--foreground)]">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Email
              </p>

              <p className="text-[var(--foreground)]">
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

          </div>

          {/* ADDRESS */}
          <div className="mt-6 border-t border-[var(--border)] pt-6">
            <p className="text-sm text-[var(--muted)]">
              Shipping Address
            </p>

            <p className="mt-1 text-[var(--foreground)]">
              {order.address}
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-3">

              <div>
                <p className="text-sm text-[var(--muted)]">
                  City
                </p>

                <p className="text-[var(--foreground)]">
                  {order.city || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--muted)]">
                  State
                </p>

                <p className="text-[var(--foreground)]">
                  {order.state || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-[var(--muted)]">
                  Pincode
                </p>

                <p className="text-[var(--foreground)]">
                  {order.pincode || "N/A"}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="card mb-6 p-6">

          <h2 className="mb-5 text-2xl">
            Products
          </h2>

          <div className="space-y-4">

            {order.items &&
            order.items.length > 0 ? (
              order.items.map(
                (item: any, index: number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                  >

                    <div className="flex items-center gap-4">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-[var(--radius-sm)] object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]">
                          📦
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium text-[var(--foreground)]">
                          {item.name}
                        </h3>

                        <p className="text-sm text-[var(--muted)]">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        {item.size && (
                          <p className="text-sm text-[var(--muted)]">
                            Size:{" "}
                            {item.size}
                          </p>
                        )}

                        <p className="text-sm text-[var(--muted)]">
                          Unit Price: ₹
                          {Number(item.price || 0)}
                        </p>
                      </div>

                    </div>

                    <p className="font-mono font-medium text-[var(--foreground)]">
                      ₹
                      {Number(item.price || 0) *
                        Number(item.quantity || 0)}
                    </p>

                  </div>
                )
              )
            ) : (
              <p className="text-[var(--muted)]">
                No products found.
              </p>
            )}

          </div>

          {/* TOTAL */}
          <div className="mt-6 flex justify-between border-t border-[var(--border)] pt-6 text-xl">
            <span className="font-medium text-[var(--foreground)]">
              Total
            </span>

            <span className="font-mono font-medium text-[var(--foreground)]">
              ₹{Number(order.total || 0)}
            </span>
          </div>

        </section>

        {/* PAYMENT */}
        <section className="card mb-6 p-6">

          <h2 className="mb-5 text-2xl">
            Payment Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-[var(--muted)]">
                Payment ID
              </p>

              <p className="break-all font-mono text-sm text-[var(--foreground)]">
                {order.paymentId || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Razorpay Order ID
              </p>

              <p className="break-all font-mono text-sm text-[var(--foreground)]">
                {order.orderId}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Status
              </p>

              <p className="font-medium text-[var(--foreground)]">
                {order.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                Order Date
              </p>

              <p className="text-[var(--foreground)]">
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleString("en-IN")
                  : "N/A"}
              </p>
            </div>

          </div>

        </section>

        {/* USER ID */}
        <section className="card p-6">

          <h2 className="mb-5 text-2xl">
            Order Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-[var(--muted)]">
                Database ID
              </p>

              <p className="break-all font-mono text-sm text-[var(--muted)]">
                {String(order._id)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--muted)]">
                User ID
              </p>

              <p className="break-all font-mono text-sm text-[var(--muted)]">
                {String(order.userId)}
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}