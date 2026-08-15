"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";

type Product = {
  _id: string;
  id?: string;

  name: string;
  price: number;

  oldPrice?: number;

  image?: string;
  hoverImage?: string;

  images?: string[];

  category?: string;
  sizes?: string[];

  rating?: number;
  discount?: string;
  description?: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("");

  const productId = product._id || product.id || "";

  const liked = isInWishlist(productId);

  const handleAddToCart = () => {
    // Agar product ke sizes hain,
    // to size select karna compulsory hoga.
    if (product.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        alert("Please select a size.");
        return;
      }
    }

    addToCart({
      id: productId,
      name: product.name,
      image: product.image || "",
      price: product.price,
      quantity: 1,
      size: selectedSize,
    });

    alert(
      selectedSize
        ? `Added to cart - Size ${selectedSize}`
        : "Added to cart"
    );
  };

  return (
    <div className="card group overflow-hidden">
      {/* ================= IMAGE ================= */}

      <Link href={`/product/${productId}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-sunken)]">

          {/* Main Image */}
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
              className="absolute inset-0 object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
            />
          )}

          {/* Hover Image */}
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
              className="absolute inset-0 object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          )}

          {/* Discount — styled as a garment price tag */}
          {product.discount && (
            <span className="tag-badge absolute left-4 top-4">
              {product.discount}
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (liked) {
                removeFromWishlist(productId);
              } else {
                addToWishlist({
                  id: productId,
                  name: product.name,
                  price: product.price,
                  image: product.image || "",
                });
              }
            }}
            className="absolute right-4 top-4 rounded-full border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition hover:border-[var(--accent)]"
          >
            <Heart
              size={18}
              className={
                liked
                  ? "fill-[var(--accent)] text-[var(--accent)]"
                  : "text-[var(--foreground)]"
              }
            />
          </button>
        </div>
      </Link>

      {/* ================= DETAILS ================= */}

      <div className="p-5">

        <h2 className="text-lg leading-snug">
          {product.name}
        </h2>

        {/* Category */}
        {product.category && (
          <p className="eyebrow mt-1">
            {product.category}
          </p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-3">
          <span className="font-mono text-xl font-medium text-[var(--foreground)]">
            ₹{product.price}
          </span>

          {product.oldPrice && (
            <span className="font-mono text-sm text-[var(--muted)] line-through">
              ₹{product.oldPrice}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating !== undefined && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            <span className="text-[var(--gold)]">★</span> {product.rating}
          </p>
        )}

        {/* ================= SIZE ================= */}

        {product.sizes &&
          product.sizes.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="input-label mb-0">
                  Select Size
                </p>

                {selectedSize && (
                  <span className="text-sm text-[var(--muted)]">
                    Selected: {selectedSize}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`rounded-[var(--radius-sm)] border py-2 font-mono text-sm transition ${
                      selectedSize === size
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

        <hr className="stitch-divider my-5" />

        {/* Add To Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn btn-primary w-full"
        >
          <ShoppingBag size={16} />
          Add To Cart
        </button>
      </div>
    </div>
  );
}