import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Edit here whenever offers change — everything else is automatic.
const OFFERS = [
  {
    title: "Buy Any 4 Regular T-Shirts @ ₹999",
    code: "GRAB04",
    note: "Limited Period Offer",
  },
  {
    title: "Buy Any 3 Designer Oversized T-Shirts @ ₹999",
    code: "DESIGNER03",
    note: "Limited Period Offer",
  },
  {
    title: "Buy Any 3 Boxy Fit Full Sleeve T-Shirts @ ₹999",
    code: "FS03",
    note: "Limited Period Offer",
  },
  {
    title: "Free Shipping on All Orders Above ₹999",
    code: "",
    note: "",
  },
];

export default function OffersPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[var(--background)]">
        <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">

          <p className="eyebrow">
            Save More
          </p>

          <h1 className="mt-2 text-5xl">
            Offers Zone
          </h1>

          <p className="mt-3 text-[var(--muted)]">
            Every active discount and coupon code, in one place.
          </p>

          <hr className="stitch-divider my-10" />

          {/* Offers List */}
          <ol className="space-y-8">
            {OFFERS.map((offer, index) => (
              <li
                key={offer.title}
                className="flex gap-4"
              >
                <span className="font-display text-2xl text-[var(--muted)]">
                  {index + 1}.
                </span>

                <div>
                  <p className="text-base leading-7 text-[var(--foreground)] sm:text-lg">
                    {offer.title}
                  </p>

                  {offer.code && (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Coupon Code:{" "}
                      <span className="font-mono font-semibold text-[var(--accent)]">
                        {offer.code}
                      </span>
                      {offer.note && (
                        <span className="ml-2">
                          ({offer.note})
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <hr className="stitch-divider my-12" />

          {/* Free Shipping Banner */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[#14120F] p-10 text-center sm:p-14">

            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#9B9384]">
              No Minimum Order
            </p>

            <h2 className="mt-3 !text-[#F2EEE6] text-4xl sm:text-5xl">
              Free Shipping
            </h2>

            <p className="mt-3 text-sm text-[#B8B2A4] sm:text-base">
              On every single order, every single time.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-[var(--radius-sm)] bg-[var(--accent)] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.1em] text-white transition hover:bg-[var(--accent-hover)]"
            >
              Shop Now
            </Link>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}