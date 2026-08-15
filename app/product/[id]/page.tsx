"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Product = {
  _id?: string;
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

export default function ProductPage() {
  const params = useParams();

  const productId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const { cart, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [adding, setAdding] =
    useState(false);

  const [added, setAdded] =
    useState(false);

  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);

  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const decodedId =
          decodeURIComponent(productId);

        console.log(
          "PRODUCT PAGE ID:",
          decodedId
        );

        // -----------------------------------------
        // FIRST TRY:
        // /api/products/[id]
        // -----------------------------------------

        try {
          const directRes = await fetch(
            `/api/products/${encodeURIComponent(
              decodedId
            )}`,
            {
              cache: "no-store",
            }
          );

          const directData =
            await directRes.json();

          console.log(
            "DIRECT PRODUCT RESPONSE:",
            directData
          );

          if (
            directRes.ok &&
            directData.success &&
            directData.product
          ) {
            const foundProduct =
              directData.product;

            setProduct(foundProduct);

            setSelectedImage(
              foundProduct.image ||
                foundProduct.images?.[0] ||
                ""
            );

            return;
          }
        } catch (directError) {
          console.log(
            "Direct product fetch failed:",
            directError
          );
        }

        // -----------------------------------------
        // FALLBACK:
        // FETCH ALL PRODUCTS
        // AND MATCH _id OR id
        // -----------------------------------------

        const allRes = await fetch(
          "/api/products",
          {
            cache: "no-store",
          }
        );

        const allData =
          await allRes.json();

        console.log(
          "ALL PRODUCTS RESPONSE:",
          allData
        );

        if (
          !allRes.ok ||
          !allData.success
        ) {
          throw new Error(
            allData.message ||
              "Failed to fetch products"
          );
        }

        const products: Product[] =
          allData.products || [];

        const foundProduct =
          products.find(
            (item) =>
              item._id === decodedId ||
              item.id === decodedId
          );

        if (!foundProduct) {
          throw new Error(
            "Product not found"
          );
        }

        setProduct(foundProduct);

        setSelectedImage(
          foundProduct.image ||
            foundProduct.images?.[0] ||
            ""
        );
      } catch (err) {
        console.error(
          "Product Page Error:",
          err
        );

        setProduct(null);

        setError(
          err instanceof Error
            ? err.message
            : "Product not found"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // =========================================
  // FETCH RELATED PRODUCTS
  // =========================================

  useEffect(() => {
    if (!product?.category) return;

    const fetchRelatedProducts =
      async () => {
        try {
          const res = await fetch(
            "/api/products",
            {
              cache: "no-store",
            }
          );

          const data =
            await res.json();

          if (
            !res.ok ||
            !data.success
          ) {
            return;
          }

          const products: Product[] =
            data.products || [];

          const currentId =
            product._id || product.id;

          const related =
            products
              .filter(
                (item) =>
                  item.category ===
                    product.category &&
                  (item._id || item.id) !==
                    currentId
              )
              .slice(0, 4);

          setRelatedProducts(related);
        } catch (error) {
          console.error(
            "Related products error:",
            error
          );
        }
      };

    fetchRelatedProducts();
  }, [product]);

  // =========================================
  // ALL PRODUCT IMAGES
  // =========================================

  const productImages = useMemo(() => {
    if (!product) return [];

    const images: string[] = [];

    if (product.image) {
      images.push(product.image);
    }

    if (product.hoverImage) {
      images.push(product.hoverImage);
    }

    if (product.images) {
      images.push(...product.images);
    }

    return Array.from(
      new Set(
        images.filter(Boolean)
      )
    );
  }, [product]);

  // =========================================
  // WISHLIST CHECK
  // =========================================

  const currentProductId =
    product?._id || product?.id || "";

  const isWishlisted =
    wishlist.some(
      (item: any) =>
        item.id === currentProductId ||
        item._id === currentProductId
    );

  const toggleWishlist = (item: Product) => {
    const wishlistId = item._id || item.id || "";
    if (!wishlistId) return;

    if (
      wishlist.some(
        (wish: any) =>
          wish.id === wishlistId ||
          wish._id === wishlistId
      )
    ) {
      removeFromWishlist(wishlistId as any);
    } else {
      addToWishlist({
        ...item,
        id: wishlistId,
      } as any);
    }
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {
    if (!product) return;

    // Size required if product has sizes
    if (
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      alert("Please select a size.");
      return;
    }

    try {
      setAdding(true);

      addToCart({
        id:
          product._id ||
          product.id ||
          "",

        name: product.name,

        price: Number(product.price),

        image:
          product.image ||
          product.images?.[0] ||
          "",

        quantity,

        size: selectedSize,
      } as any);

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        "Unable to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  // =========================================
  // QUANTITY
  // =========================================

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      Math.max(1, prev - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((prev) =>
      prev + 1
    );
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />

            <p className="mt-4 text-gray-500">
              Loading product...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {
    return (
      <>
        <Header />

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="text-6xl">
              📦
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Product Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              {error ||
                "This product may have been removed or is no longer available."}
            </p>

            <p className="mt-2 break-all text-xs text-gray-400">
              Product ID: {productId}
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:opacity-80"
            >
              Back to Shop
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">

        {/* =====================================
            BREADCRUMB
        ===================================== */}

        <div className="mb-8 text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-black"
          >
            Home
          </Link>

          <span className="mx-2">
            /
          </span>

          <Link
            href="/shop"
            className="hover:text-black"
          >
            Shop
          </Link>

          {product.category && (
            <>
              <span className="mx-2">
                /
              </span>

              <span>
                {product.category}
              </span>
            </>
          )}
        </div>

        {/* =====================================
            PRODUCT
        ===================================== */}

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ===================================
              IMAGES
          =================================== */}

          <div>

            {/* Main Image */}

            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnail Images */}

            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {productImages.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          image
                        )
                      }
                      className={`aspect-square overflow-hidden rounded-xl border-2 ${
                        selectedImage === image
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ===================================
              PRODUCT INFORMATION
          =================================== */}

          <div className="flex flex-col justify-center">

            {/* Category */}

            {product.category && (
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                {product.category}
              </p>
            )}

            {/* Name */}

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}

            {product.rating !== undefined && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-lg">
                  ★
                </span>

                <span className="font-medium">
                  {product.rating}
                </span>

                <span className="text-gray-400">
                  / 5
                </span>
              </div>
            )}

            {/* Price */}

            <div className="mt-6 flex flex-wrap items-center gap-4">

              <span className="text-3xl font-bold">
                ₹
                {Number(
                  product.price || 0
                )}
              </span>

              {product.oldPrice &&
                product.oldPrice >
                  product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹
                    {Number(
                      product.oldPrice
                    )}
                  </span>
                )}

              {product.discount && (
                <span className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Description */}

            <div className="mt-8 border-t pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {product.description ||
                  "Premium quality product designed for everyday comfort and style."}
              </p>
            </div>

            {/* Size */}

            {product.sizes &&
              product.sizes.length > 0 && (
                <div className="mt-8">

                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                      Select Size
                    </h2>

                    <span className="text-xs text-gray-400">
                      Required
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.sizes.map(
                      (size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSize(
                              size
                            )
                          }
                          className={`min-w-14 rounded-full border px-5 py-3 text-sm font-semibold transition ${
                            selectedSize ===
                            size
                              ? "border-black bg-black text-white"
                              : "border-gray-300 hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Quantity */}

            <div className="mt-8">

              <h2 className="text-sm font-semibold">
                Quantity
              </h2>

              <div className="mt-3 flex w-fit items-center overflow-hidden rounded-full border">

                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  className="px-5 py-3 text-lg transition hover:bg-gray-100"
                >
                  −
                </button>

                <span className="min-w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  className="px-5 py-3 text-lg transition hover:bg-gray-100"
                >
                  +
                </button>

              </div>
            </div>

            {/* Buttons */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={adding}
                className="flex-1 rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {adding
                  ? "Adding..."
                  : added
                  ? "✓ Added to Cart"
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleWishlist(
                    product as any
                  )
                }
                className={`rounded-full border px-8 py-4 font-semibold transition ${
                  isWishlisted
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                {isWishlisted
                  ? "♥ Wishlisted"
                  : "♡ Wishlist"}
              </button>

            </div>

            {/* Delivery Information */}

            <div className="mt-8 grid gap-3 border-t pt-8 sm:grid-cols-3">

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-semibold">
                  🚚 Fast Delivery
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Reliable shipping
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-semibold">
                  🔒 Secure Payment
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Safe checkout
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-sm font-semibold">
                  ↩ Easy Returns
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Hassle-free returns
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* =====================================
            RELATED PRODUCTS
        ===================================== */}

        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t pt-16">

            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                You may also like
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Related Products
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

              {relatedProducts.map(
                (item) => {
                  const id =
                    item._id ||
                    item.id ||
                    "";

                  return (
                    <Link
                      key={id}
                      href={`/product/${id}`}
                      className="group"
                    >

                      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No Image
                          </div>
                        )}

                      </div>

                      <h3 className="mt-3 font-semibold">
                        {item.name}
                      </h3>

                      <p className="mt-1 font-medium">
                        ₹
                        {Number(
                          item.price || 0
                        )}
                      </p>

                    </Link>
                  );
                }
              )}

            </div>
          </section>
        )}

      </main>

      <Footer />
    </>
  );
}