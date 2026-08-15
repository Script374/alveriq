"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, User, LogOut, ShoppingBag } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type UserData = {
  id: string;
  name: string;
  email: string;
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          router.push("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Account user error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Logout failed");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to logout. Please try again.");
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-[70vh] items-center justify-center bg-[var(--background)]">
          <p className="font-mono text-sm uppercase tracking-[0.12em] text-[var(--muted)]">
            Loading account...
          </p>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-16 bg-[var(--background)]">
        {/* Header */}
        <section className="mb-12">
          <p className="eyebrow">My Account</p>

          <h1 className="mt-2">Hello, {user.name}</h1>

          <p className="mt-3 text-[var(--muted)]">
            Manage your account and orders.
          </p>
        </section>

        {/* Profile */}
        <section className="card p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
              <User size={24} />
            </div>

            <div>
              <h2 className="text-xl">{user.name}</h2>
              <p className="font-mono text-sm text-[var(--muted)]">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Account Options */}
        <section className="mt-6 grid gap-6 md:grid-cols-3">
          {/* My Orders */}
          <Link href="/account/orders" className="card group block p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
              <Package size={20} />
            </div>

            <h2 className="mt-6 text-xl">My Orders</h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              View your orders and track deliveries.
            </p>

            <div className="mt-5 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.1em] text-[var(--accent)] transition group-hover:gap-2">
              View Orders <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Shop */}
          <Link href="/shop" className="card group block p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
              <ShoppingBag size={20} />
            </div>

            <h2 className="mt-6 text-xl">Continue Shopping</h2>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Explore the latest ALVERIQ collection.
            </p>

            <div className="mt-5 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.1em] text-[var(--accent)] transition group-hover:gap-2">
              Shop Now <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Profile Details */}
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
              <User size={20} />
            </div>

            <h2 className="mt-6 text-xl">Profile</h2>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-[var(--foreground)]">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  Name
                </span>
                <br />
                {user.name}
              </p>

              <p className="text-[var(--foreground)]">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                  Email
                </span>
                <br />
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Logout */}
        <section className="mt-6">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn btn-secondary w-full"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}