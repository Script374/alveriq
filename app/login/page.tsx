"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      console.log("Login Success:", data);

      router.push("/account");
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <div className="text-center">
          <p className="eyebrow">
            ALVERIQ
          </p>

          <h1 className="mt-3">
            Welcome Back
          </h1>

          <p className="mt-3 text-[var(--muted)]">
            Login to your ALVERIQ account.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="card mt-10 p-8"
        >

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-[var(--radius-sm)] border border-[var(--accent)] bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent)]">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="input-label">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="input"
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <label className="input-label">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              className="input"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-7 w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Create Account
            </Link>
          </p>

        </form>

      </div>
    </main>
  );
}