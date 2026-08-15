"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

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

  createdAt?: string;
};

type ProductGridProps = {
  category: string;
  price: string;
  size: string;
  sort: string;
  newOnly?: boolean;
};

export default function ProductGrid({
  category,
  price,
  size,
  sort,
  newOnly = false,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error(
          "Products fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="h-[420px] animate-pulse rounded-[var(--radius-md)] bg-[var(--border)]"
          />
        ))}
      </div>
    );
  }

  let filteredProducts = [...products];

  /* --------------------------------
     New Arrivals
  -------------------------------- */

  if (newOnly) {
    filteredProducts.sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    });

    filteredProducts = filteredProducts.slice(0, 20);
  }

  /* --------------------------------
     Category
  -------------------------------- */

  if (category) {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.category === category
      );
  }

  /* --------------------------------
     Price
  -------------------------------- */

  if (price === "999") {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.price <= 999
      );
  }

  if (price === "1999") {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.price >= 1000 &&
          product.price <= 1999
      );
  }

  if (price === "2000") {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.price >= 2000
      );
  }

  /* --------------------------------
     Size
  -------------------------------- */

  if (size) {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          product.sizes?.includes(size)
      );
  }

  /* --------------------------------
     Sorting
  -------------------------------- */

  if (sort === "Newest") {
    filteredProducts.sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    });
  }

  if (sort === "Price: Low to High") {
    filteredProducts.sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "Price: High to Low") {
    filteredProducts.sort(
      (a, b) => b.price - a.price
    );
  }

  /* --------------------------------
     No Products
  -------------------------------- */

  if (filteredProducts.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-lg font-medium text-[var(--foreground)]">
          No Products Found 😔
        </p>

        <p className="mt-2 text-sm text-[var(--muted)]">
          Try changing your filters.
        </p>
      </div>
    );
  }

  /* --------------------------------
     Products
  -------------------------------- */

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={{
            ...product,
            id: product.id || product._id,
          }}
        />
      ))}
    </div>
  );
}