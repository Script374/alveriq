"use client";

import { useEffect, useState } from "react";

type Offer = {
  code: string;
  label: string;
};

// Edit here whenever the offer changes — everything else is automatic.
const OFFERS: Offer[] = [
  {
    code: "GRAB04",
    label: "Buy Any 4 Regular T-Shirts @ ₹999",
  },
];

// Countdown resets every day at midnight — always a live, valid
// timer for every visitor without needing a backend deadline.
function getMsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  return midnight.getTime() - now.getTime();
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return {
    hrs: String(hrs).padStart(2, "0"),
    mins: String(mins).padStart(2, "0"),
    secs: String(secs).padStart(2, "0"),
  };
}

const DISMISS_KEY = "alveriq_offer_bar_dismissed_date";

export default function StickyOfferBar() {
  const [msLeft, setMsLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [copied, setCopied] = useState(false);

  const offer = OFFERS[0];

  useEffect(() => {
    // Shows once per day per visitor — dismissing it doesn't
    // nag them again until the offer actually resets at midnight.
    const today = new Date().toDateString();

    const dismissedDate =
      typeof window !== "undefined"
        ? localStorage.getItem(DISMISS_KEY)
        : null;

    setDismissed(dismissedDate === today);
    setMsLeft(getMsUntilMidnight());

    const interval = setInterval(() => {
      setMsLeft(getMsUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    const today = new Date().toDateString();
    localStorage.setItem(DISMISS_KEY, today);
    setDismissed(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (!offer || dismissed || msLeft === null) return null;

  const { hrs, mins, secs } = formatTime(msLeft);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">

        {/* Offer text + countdown */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
          <p className="truncate text-xs font-medium text-[var(--foreground)] sm:text-sm">
            {offer.label}{" "}
            <span className="font-mono text-[var(--accent,#7a1f2b)]">
              {offer.code}
            </span>
          </p>

          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-[var(--muted)] sm:text-xs">
            <span>Ends in:</span>
            <span className="font-semibold text-[var(--foreground)]">
              {hrs}h
            </span>
            <span className="font-semibold text-[var(--foreground)]">
              {mins}m
            </span>
            <span className="font-semibold text-[var(--foreground)]">
              {secs}s
            </span>
          </div>
        </div>

        {/* Copy code + dismiss */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="whitespace-nowrap rounded-sm bg-[var(--foreground)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--surface)] transition hover:opacity-85 sm:text-xs"
          >
            {copied ? "Copied ✓" : "Copy Code"}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss offer"
            className="text-lg leading-none text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            ×
          </button>
        </div>

      </div>
    </div>
  );
}