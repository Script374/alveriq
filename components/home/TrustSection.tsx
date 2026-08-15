import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    number: "01",
    title: "Premium Quality",
    description:
      "Thoughtfully selected fabrics and refined construction made for everyday wear.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Secure Checkout",
    description:
      "Your payments and personal information are protected throughout your purchase.",
  },
  {
    icon: Truck,
    number: "03",
    title: "Fast Shipping",
    description:
      "Reliable delivery designed to get your ALVERIQ essentials to you quickly.",
  },
  {
    icon: RotateCcw,
    number: "04",
    title: "Easy Returns",
    description:
      "A straightforward return experience when something isn't quite right.",
  },
];

export default function TrustSection() {
  return (
    <>
      {/* Happy Customers Strip — full-bleed dark band */}
      <div className="bg-[#14120F] py-4 sm:py-5">
        <p className="text-center font-mono text-xs uppercase tracking-[0.24em] text-[#F2EEE6] sm:text-sm sm:tracking-[0.3em]">
          Over 1 Million Happy Customers
        </p>
      </div>

      <section className="bg-[var(--background)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">
              The ALVERIQ Standard
            </p>

            <h2 className="mt-3">
              Designed around you.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
              From the first click to delivery, every part of
              the ALVERIQ experience is designed to feel simple,
              considered and dependable.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-12 grid border-y border-[var(--border)] sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.number}
                  className={[
                    "group px-5 py-8 sm:px-7 sm:py-9 lg:px-8 lg:py-10",
                    index < benefits.length - 1
                      ? "border-b border-[var(--border)] lg:border-b-0 lg:border-r"
                      : "",
                    index % 2 === 0
                      ? "sm:border-r"
                      : "",
                    index === 1
                      ? "lg:border-r"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] transition-colors duration-200 group-hover:border-[var(--accent)]">
                      <Icon
                        size={18}
                        strokeWidth={1.6}
                      />
                    </div>

                    <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--muted)]">
                      {benefit.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg sm:mt-7">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center sm:mt-10">
            <Link
              href="/shop"
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent)] sm:text-[10px]"
            >
              Experience ALVERIQ
              <span className="ml-2">→</span>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}