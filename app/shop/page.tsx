"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/product/ProductGrid";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ShopPage() {
  const searchParams = useSearchParams();

 const [category, setCategory] = useState("");
const [price, setPrice] = useState("");
const [size, setSize] = useState("");
const [sort, setSort] = useState("Newest");
const [newOnly, setNewOnly] = useState(false);
const [filtersOpen, setFiltersOpen] = useState(false);
 useEffect(() => {
  const categoryFromUrl =
    searchParams.get("category") || "";

  const newFromUrl =
    searchParams.get("new") === "true";

  setCategory(categoryFromUrl);
  setNewOnly(newFromUrl);

  if (newFromUrl) {
    setSort("Newest");
  }
}, [searchParams]);

  const toggleSize = (itemSize: string) => {
    setSize((current) =>
      current === itemSize ? "" : itemSize
    );
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[var(--background)]">
        <section className="mx-auto max-w-7xl px-6 py-14">

          {/* Shop Header */}
          <div className="mb-8 flex flex-col justify-between gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-end">

            <div>
              <p className="eyebrow">
                ALVERIQ COLLECTION
              </p>

              <h1 className="mt-2 text-5xl">
                {newOnly
                  ? "New Arrivals"
                  : category || "Shop"}
              </h1>

              <p className="mt-3 text-[var(--muted)]">
                Discover premium fashion crafted for modern style.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
                Explore Collection
              </span>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="Newest">
                  Newest
                </option>

                <option value="Price: Low to High">
                  Price: Low to High
                </option>

                <option value="Price: High to Low">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>

          {/* Quick Size Select — prominent strip above the grid,
              syncs with the same `size` state as the sidebar filter */}
          <div className="mb-12 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-6 py-6 text-center sm:py-7">

            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] sm:text-sm">
              Choose your size for better experience
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {SIZES.map((itemSize) => (
                <button
                  key={itemSize}
                  type="button"
                  onClick={() => toggleSize(itemSize)}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition sm:h-12 sm:w-12 sm:text-sm ${
                    size === itemSize
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }`}
                >
                  {itemSize}
                </button>
              ))}
            </div>

            {size && (
              <button
                onClick={() => setSize("")}
                className="mt-4 text-sm text-[var(--accent)] hover:underline"
              >
                Clear Size
              </button>
            )}
          </div>

          {/* Shop Layout */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">

            {/* Sidebar Overlay — mobile only */}
            <div
              onClick={() => setFiltersOpen(false)}
              className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
                filtersOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0"
              }`}
            />

            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-md transition-transform duration-300 ${
                filtersOpen
                  ? "translate-x-0"
                  : "translate-x-full"
              } lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:shadow-none lg:transition-none`}
            >

              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl">
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="rounded-full p-2 transition hover:bg-[var(--surface-sunken)] lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category */}
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  Category
                </h3>

                <div className="space-y-3 text-[var(--foreground)]">

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={category === "Shirts"}
                      onChange={() =>
                        setCategory("Shirts")
                      }
                      className="accent-[var(--accent)]"
                    />
                    Shirts
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={category === "T-Shirts"}
                      onChange={() =>
                        setCategory("T-Shirts")
                      }
                      className="accent-[var(--accent)]"
                    />
                    T-Shirts
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={category === "Jeans"}
                      onChange={() =>
                        setCategory("Jeans")
                      }
                      className="accent-[var(--accent)]"
                    />
                    Jeans
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={category === "Oversized"}
                      onChange={() =>
                        setCategory("Oversized")
                      }
                      className="accent-[var(--accent)]"
                    />
                    Oversized
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={category === "Co-ords"}
                      onChange={() =>
                        setCategory("Co-ords")
                      }
                      className="accent-[var(--accent)]"
                    />
                    Co-ords
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={category === "Sale"}
                      onChange={() =>
                        setCategory("Sale")
                      }
                      className="accent-[var(--accent)]"
                    />
                    Sale
                  </label>

                </div>

                <button
                  onClick={() => setCategory("")}
                  className="mt-4 text-sm text-[var(--accent)] hover:underline"
                >
                  Clear Category
                </button>
              </div>

              {/* Divider */}
              <hr className="stitch-divider my-8" />

              {/* Price */}
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  Price
                </h3>

                <div className="space-y-3 text-[var(--foreground)]">

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="price"
                      checked={price === "999"}
                      onChange={() =>
                        setPrice("999")
                      }
                      className="accent-[var(--accent)]"
                    />
                    Under ₹999
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="price"
                      checked={price === "1999"}
                      onChange={() =>
                        setPrice("1999")
                      }
                      className="accent-[var(--accent)]"
                    />
                    ₹1000 - ₹1999
                  </label>

                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="price"
                      checked={price === "2000"}
                      onChange={() =>
                        setPrice("2000")
                      }
                      className="accent-[var(--accent)]"
                    />
                    ₹2000+
                  </label>

                </div>

                <button
                  onClick={() => setPrice("")}
                  className="mt-4 text-sm text-[var(--accent)] hover:underline"
                >
                  Clear Price
                </button>
              </div>

              {/* Divider */}
              <hr className="stitch-divider my-8" />

              {/* Size */}
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  Size
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  {SIZES.map(
                    (itemSize) => (
                      <button
                        key={itemSize}
                        type="button"
                        onClick={() =>
                          toggleSize(itemSize)
                        }
                        className={`rounded-[var(--radius-sm)] border py-2 font-mono text-sm transition ${
                          size === itemSize
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        }`}
                      >
                        {itemSize}
                      </button>
                    )
                  )}

                </div>

                {size && (
                  <button
                    onClick={() => setSize("")}
                    className="mt-4 text-sm text-[var(--accent)] hover:underline"
                  >
                    Clear Size
                  </button>
                )}
              </div>

              {/* New Arrivals */}
              {newOnly && (
                <>
                  <hr className="stitch-divider my-8" />

                  <div className="rounded-[var(--radius-sm)] bg-[#14120F] p-4 text-[#F2EEE6]">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9B9384]">
                      Collection
                    </p>

                    <p className="mt-1 font-medium">
                      New Arrivals
                    </p>

                    <button
                      onClick={() => {
                        setNewOnly(false);
                        window.location.href =
                          "/shop";
                      }}
                      className="mt-3 text-sm text-[#B5546A] underline"
                    >
                      View All Products
                    </button>
                  </div>
                </>
              )}

            </aside>

            {/* Products */}
            <div className="lg:col-span-3">
              <ProductGrid
                category={category}
                price={price}
                size={size}
                sort={sort}
                newOnly={newOnly}
              />
            </div>

          </div>
        </section>
      </main>

      {/* Floating Filters Trigger — mobile only */}
      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        aria-label="Open filters"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] text-white shadow-md transition hover:bg-[var(--accent-hover)] lg:hidden"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

      <Footer />
    </>
  );
}