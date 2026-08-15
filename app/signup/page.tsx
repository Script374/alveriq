"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Signup failed"
        );
      }

      console.log("Signup Success:", data);

      router.push("/login");
    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Signup failed"
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
            Create Account
          </h1>

          <p className="mt-3 text-[var(--muted)]">
            Create your ALVERIQ account.
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          className="card mt-10 p-8"
        >

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-[var(--radius-sm)] border border-[var(--accent)] bg-[var(--accent-soft)] p-4 text-sm text-[var(--accent)]">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="input-label">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              className="input"
            />
          </div>

          {/* Email */}
          <div className="mt-5">
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
              placeholder="Create password"
              className="input"
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-5">
            <label className="input-label">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm password"
              className="input"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-7 w-full"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Login
            </Link>
          </p>

        </form>

      </div>
    </main>
  );
}