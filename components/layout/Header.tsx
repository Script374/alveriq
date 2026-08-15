"use client";

import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CartDrawer from "@/components/cart/CartDrawer";
import {
  ArrowLeft,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

type Product = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image?: string;
};

const CATEGORY_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "Shirts", href: "/shop?category=Shirts" },
  { label: "T-Shirts", href: "/shop?category=T-Shirts" },
  { label: "Jeans", href: "/shop?category=Jeans" },
  { label: "Oversized", href: "/shop?category=Oversized" },
  { label: "Co-ords", href: "/shop?category=Co-ords" },
  { label: "Sale", href: "/shop?category=Sale" },
];

const PRICE_LINKS = [
  { label: "Under ₹999", href: "/shop?price=999" },
  { label: "₹1000 - ₹1999", href: "/shop?price=1999" },
  { label: "₹2000+", href: "/shop?price=2000" },
];

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlist.length;

  useEffect(() => {
    fetch("/api/auth/me", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not logged in");
        }

        return res.json();
      })
      .then((data) => {
        setLoggedIn(Boolean(data.success));
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Header products error:", error);
      }
    };

    loadProducts();
  }, []);

  // Lock body scroll while the mobile drawer or search overlay is open
  useEffect(() => {
    if (mobileMenuOpen || searchOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, searchOverlayOpen]);

  // Autofocus the input the moment the overlay opens
  useEffect(() => {
    if (searchOverlayOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchOverlayOpen]);

  const searchResults = useMemo(() => {
    if (!search.trim()) {
      return [];
    }

    return products
      .filter((product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .slice(0, 5);
  }, [search, products]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openSearchOverlay = () => {
    setSearchOverlayOpen(true);
  };

  const closeSearchOverlay = () => {
    setSearchOverlayOpen(false);
    setSearch("");
  };

  const openAccount = () => {
    closeMobileMenu();

    window.location.href = loggedIn
      ? "/account"
      : "/login";
  };

  const navigation = [
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "New",
      href: "/shop?new=true",
    },
    {
      label: "Track Order",
      href: "/track-order",
    },
    {
      label: "Shirts",
      href: "/shop?category=Shirts",
    },
    {
      label: "T-Shirts",
      href: "/shop?category=T-Shirts",
    },
    {
      label: "Jeans",
      href: "/shop?category=Jeans",
    },
    {
      label: "Sale",
      href: "/shop?category=Sale",
    },
  ];

  return (
    <>
      <div className="bg-[var(--accent)] px-4 py-2.5 text-center font-mono text-[11px] tracking-[0.12em] text-white sm:text-xs">
        Free Shipping on Orders Above ₹999
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center px-4 sm:h-[72px] sm:px-6 lg:h-20 lg:px-8">

          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen((open) => !open)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--foreground)] transition hover:bg-[var(--surface-sunken)] lg:hidden"
          >
            {mobileMenuOpen ? (
              <X
                size={21}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={21}
                strokeWidth={1.8}
              />
            )}
          </button>

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="
              absolute
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              font-display
              text-[17px]
              tracking-[0.14em]
              text-[var(--foreground)]
              transition-colors
              hover:text-[var(--accent)]
              sm:text-xl
              sm:tracking-[0.18em]
              md:text-2xl
              md:tracking-[0.22em]
              lg:static
              lg:ml-0
              lg:translate-x-0
              lg:text-3xl
              lg:tracking-[0.28em]
            "
          >
            ALVERIQ
          </Link>

          <nav className="ml-10 hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted)] lg:flex xl:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="
                  relative
                  py-2
                  transition-colors
                  duration-200
                  after:absolute
                  after:bottom-0
                  after:left-0
                  after:h-px
                  after:w-0
                  after:bg-[var(--accent)]
                  after:transition-all
                  after:duration-200
                  hover:text-[var(--foreground)]
                  hover:after:w-full
                "
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/my-orders"
              className="
                relative
                py-2
                transition-colors
                duration-200
                after:absolute
                after:bottom-0
                after:left-0
                after:h-px
                after:w-0
                after:bg-[var(--accent)]
                after:transition-all
                after:duration-200
                hover:text-[var(--foreground)]
                hover:after:w-full
              "
            >
              My Orders
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:gap-3">

            <div className="relative hidden items-center md:flex">
              <Search
                size={18}
                strokeWidth={1.8}
                className="shrink-0 text-[var(--muted)]"
              />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  ml-2
                  w-28
                  border-b
                  border-transparent
                  bg-transparent
                  py-1
                  font-sans
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition
                  focus:border-[var(--accent)]
                  lg:w-40
                "
              />

              {searchResults.length > 0 && (
                <div className="absolute left-0 top-11 z-50 w-80 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
                  {searchResults.map((product) => {
                    const productId =
                      product.id || product._id;

                    return (
                      <Link
                        key={productId}
                        href={`/product/${productId}`}
                        onClick={() =>
                          setSearch("")
                        }
                        className="
                          flex
                          items-center
                          gap-3
                          border-b
                          border-[var(--border)]
                          p-3
                          transition
                          last:border-0
                          hover:bg-[var(--surface-sunken)]
                        "
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-[var(--radius-sm)] object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]" />
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-medium text-[var(--foreground)]">
                            {product.name}
                          </h3>

                          <p className="mt-1 font-mono text-sm text-[var(--muted)]">
                            ₹{product.price}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="Search products"
              onClick={openSearchOverlay}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[var(--radius-md)]
                transition
                hover:bg-[var(--surface-sunken)]
                md:hidden
              "
            >
              <Search
                size={20}
                strokeWidth={1.8}
              />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="
                relative
                hidden
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[var(--radius-md)]
                transition
                hover:bg-[var(--surface-sunken)]
                sm:flex
              "
            >
              <Heart
                size={20}
                strokeWidth={1.8}
              />

              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 font-mono text-[9px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[var(--radius-md)]
                transition
                hover:bg-[var(--surface-sunken)]
              "
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.8}
              />

              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 font-mono text-[9px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label={
                loggedIn
                  ? "My Account"
                  : "Login"
              }
              onClick={openAccount}
              className="
                hidden
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[var(--radius-md)]
                transition
                hover:bg-[var(--surface-sunken)]
                sm:flex
              "
            >
              <User
                size={20}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================
          MOBILE SLIDE-IN DRAWER (kwabey-style)
      ======================================== */}

      {/* Backdrop */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-full max-w-sm flex-col overflow-y-auto bg-[var(--surface)] shadow-[var(--shadow-md)] transition-transform duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Top banner */}
        <div className="relative flex shrink-0 items-center justify-center bg-[var(--accent)] px-6 py-6 text-center">
          <p className="font-display text-lg text-white">
            Free Shipping
          </p>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 px-6 py-4">

          {/* My Account */}
          <p className="pt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            My Account
          </p>

          <div className="divide-y divide-[var(--border)]">
            <button
              type="button"
              onClick={openAccount}
              className="flex w-full items-center justify-between py-3.5 text-left text-base font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
            >
              <span>
                {loggedIn ? "My Account" : "Login"}
              </span>
              <span className="text-[var(--muted)]">→</span>
            </button>

            <Link
              href="/my-orders"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-base font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
            >
              <span>My Orders</span>
              <span className="text-[var(--muted)]">→</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-base font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
            >
              <span>Wishlist</span>
              <span className="text-[var(--muted)]">→</span>
            </Link>

            <Link
              href="/track-order"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-base font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
            >
              <span>Track Order</span>
              <span className="text-[var(--muted)]">→</span>
            </Link>
          </div>

          <hr className="stitch-divider my-6" />

          {/* Shop By Category */}
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            Shop By Category
          </p>

          <div className="divide-y divide-[var(--border)]">
            {CATEGORY_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className="flex items-center justify-between py-3.5 text-base font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
              >
                <span>{item.label}</span>
                <span className="text-[var(--muted)]">→</span>
              </Link>
            ))}

            <Link
              href="/shop?new=true"
              onClick={closeMobileMenu}
              className="flex items-center justify-between py-3.5 text-base font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
            >
              <span>New Arrivals</span>
              <span className="text-[var(--muted)]">→</span>
            </Link>
          </div>

          <hr className="stitch-divider my-6" />

          {/* Shop By Price */}
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            Shop By Price
          </p>

          <div className="divide-y divide-[var(--border)]">
            {PRICE_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className="flex items-center justify-between py-3.5 text-base font-medium text-[var(--foreground)] transition hover:text-[var(--accent)]"
              >
                <span>{item.label}</span>
                <span className="text-[var(--muted)]">→</span>
              </Link>
            ))}
          </div>

          <hr className="stitch-divider my-6" />

          {/* Search */}
          <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-4 transition focus-within:border-[var(--accent)]">
            <Search
              size={18}
              className="shrink-0 text-[var(--muted)]"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-transparent px-3 py-3 text-sm text-[var(--foreground)] outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
              {searchResults.map((product) => {
                const productId =
                  product.id || product._id;

                return (
                  <Link
                    key={productId}
                    href={`/product/${productId}`}
                    onClick={() => {
                      setSearch("");
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 border-b border-[var(--border)] p-3 last:border-0 hover:bg-[var(--surface-sunken)]"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-[var(--radius-sm)] object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]" />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {product.name}
                      </p>

                      <p className="font-mono text-sm text-[var(--muted)]">
                        ₹{product.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </nav>
      </aside>

      {/* ========================================
          FULL-SCREEN SEARCH OVERLAY (kwabey-style)
          Mobile only — desktop already has the
          inline search box above
      ======================================== */}

      <div
        className={`fixed inset-0 z-[90] flex flex-col bg-[var(--background)] transition-transform duration-300 md:hidden ${
          searchOverlayOpen
            ? "translate-y-0"
            : "-translate-y-full"
        }`}
      >

        {/* Top bar */}
        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <button
            type="button"
            onClick={closeSearchOverlay}
            aria-label="Close search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--foreground)] transition hover:bg-[var(--surface-sunken)]"
          >
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>

          <div className="flex flex-1 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-strong)] px-3 py-2.5 transition focus-within:border-[var(--accent)]">
            <Search
              size={18}
              strokeWidth={1.8}
              className="shrink-0 text-[var(--muted)]"
            />

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search anything you want..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 py-4">

          {search.trim() === "" ? (
            <p className="text-center text-sm text-[var(--muted)]">
              Start typing to search products...
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-sm text-[var(--muted)]">
              No products found for &ldquo;{search}&rdquo;
            </p>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {searchResults.map((product) => {
                const productId =
                  product.id || product._id;

                return (
                  <Link
                    key={productId}
                    href={`/product/${productId}`}
                    onClick={closeSearchOverlay}
                    className="flex items-center gap-3 py-3.5"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-[var(--radius-sm)] object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]" />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {product.name}
                      </p>

                      <p className="mt-1 font-mono text-sm text-[var(--muted)]">
                        ₹{product.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}