import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const shopLinks = [
  { label: "New Arrivals", href: "/shop?new=true" },
  { label: "Shirts", href: "/shop?category=Shirts" },
  { label: "T-Shirts", href: "/shop?category=T-Shirts" },
  { label: "Jeans", href: "/shop?category=Jeans" },
  { label: "Sale", href: "/shop?category=Sale" },
];

const supportLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Returns", href: "/returns" },
  { label: "Shipping", href: "/shipping" },
  { label: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: FaXTwitter,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: FaYoutube,
  },
];

const paymentMethods = [
  "Visa",
  "Mastercard",
  "RuPay",
  "UPI",
  "Google Pay",
  "PhonePe",
  "Paytm",
];

export default function Footer() {
  return (
    <footer className="bg-[#14120F] text-[#F2EEE6]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-6 sm:py-16 md:grid-cols-4 md:gap-10 lg:px-8">

        {/* BRAND */}
        <div className="md:pr-8">
          <Link
            href="/"
            aria-label="ALVERIQ home"
            className="inline-block font-display text-2xl tracking-[0.22em] text-[#F2EEE6] transition-colors duration-200 hover:text-[#B5546A] sm:text-3xl sm:tracking-[0.3em]"
          >
            ALVERIQ
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-[#9B9384]">
            Premium fashion crafted for modern everyday style.
            Timeless essentials made for every wardrobe.
          </p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9B9384]">
            Shop
          </h3>

          <nav aria-label="Shop">
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-[#F2EEE6] transition-colors duration-200 hover:text-[#B5546A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9B9384]">
            Support
          </h3>

          <nav aria-label="Support">
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-[#F2EEE6] transition-colors duration-200 hover:text-[#B5546A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9B9384]">
            Follow Us
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-white/15 text-[#F2EEE6] transition-all duration-200 hover:border-[#B5546A] hover:bg-[#B5546A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5546A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14120F]"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

      </div>

      {/* PAYMENT METHODS */}
      <div className="border-t border-white/10 px-5 py-8 text-center sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9B9384] sm:text-xs">
          100% Secure Payment
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-[var(--radius-sm)] border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#F2EEE6]"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 px-5 py-6 text-center sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#9B9384] sm:text-xs">
          © 2026 ALVERIQ. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}