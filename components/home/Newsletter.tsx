"use client";

import { FormEvent, useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="bg-[#14120F] py-16 text-[#F2EEE6] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">

        {/* Icon */}
        <div className="mx-auto flex h-11 w-11 items-center justify-center border border-[#A6874C]/35 text-[#C9AC71]">
          {submitted ? (
            <Check
              size={19}
              strokeWidth={1.7}
            />
          ) : (
            <Mail
              size={19}
              strokeWidth={1.7}
            />
          )}
        </div>

        {/* Eyebrow */}
        <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.3em] text-[#9B9384] sm:text-[10px] sm:tracking-[0.35em]">
          {submitted ? "You're In" : "Stay Updated"}
        </p>

        {/* Heading */}
        <h2 className="mt-3 !text-[#F2EEE6] text-3xl sm:text-4xl lg:text-5xl">
          {submitted
            ? "Welcome to ALVERIQ."
            : "Join the ALVERIQ Community"}
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#9B9384] sm:text-base">
          {submitted
            ? "You'll be the first to hear about new collections, exclusive drops and early access."
            : "Subscribe for exclusive drops, early access and carefully selected offers."}
        </p>

        {/* Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-2"
          >
            <label
              htmlFor="newsletter-email"
              className="sr-only"
            >
              Email address
            </label>

            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email address"
              className="min-h-12 flex-1 border border-white/15 bg-white/[0.03] px-4 font-sans text-sm text-[#F2EEE6] outline-none transition-colors placeholder:text-[#9B9384] focus:border-[#B5546A]"
            />

            <button
              type="submit"
              className="btn min-h-12 border-[#B5546A] bg-[#B5546A] px-6 text-white hover:border-[#C56A7E] hover:bg-[#C56A7E]"
            >
              Subscribe

              <ArrowRight
                size={15}
                strokeWidth={1.8}
              />
            </button>
          </form>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#9B9384] transition-colors hover:text-[#B5546A]"
            >
              Subscribe another email

              <span className="ml-2">
                →
              </span>
            </button>
          </div>
        )}

        {/* Fine print */}
        <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.1em] text-[#6F695F]">
          No spam. Just ALVERIQ.
        </p>
      </div>
    </section>
  );
}