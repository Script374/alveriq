"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
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

type ProductForm = {
  name: string;
  price: string;
  oldPrice: string;
  image: string;
  hoverImage: string;
  images: string[];
  category: string;
  sizes: string;
  rating: string;
  discount: string;
  description: string;
};

const emptyForm: ProductForm = {
  name: "",
  price: "",
  oldPrice: "",
  image: "",
  hoverImage: "",
  images: [],
  category: "",
  sizes: "",
  rating: "",
  discount: "",
  description: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<ProductForm>(emptyForm);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/products");

      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Products fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (product: Product) => {
    console.log("EDIT PRODUCT:", product);

    setEditingId(product._id);

    setForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      oldPrice: product.oldPrice?.toString() || "",
      image: product.image || "",
      hoverImage: product.hoverImage || "",
      images: product.images || [],
      category: product.category || "",
      sizes: product.sizes?.join(", ") || "",
      rating: product.rating?.toString() || "",
      discount: product.discount || "",
      description: product.description || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // FORM CHANGE
  // =========================

  const updateForm = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // ADD GALLERY IMAGE
  // =========================

  const addGalleryImage = () => {
    const image = window.prompt(
      "Enter product image URL"
    );

    if (!image) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        image.trim(),
      ],
    }));
  };

  // =========================
  // REMOVE GALLERY IMAGE
  // =========================

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =========================
  // SAVE PRODUCT
  // =========================

  const saveProduct = async () => {
    if (!form.name || !form.price) {
      alert(
        "Please enter product name and price."
      );
      return;
    }

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),

        oldPrice: form.oldPrice
          ? Number(form.oldPrice)
          : undefined,

        image: form.image,
        hoverImage: form.hoverImage,

        images: form.images,

        category: form.category,

        sizes: form.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),

        rating: form.rating
          ? Number(form.rating)
          : 0,

        discount: form.discount,

        description: form.description,
      };

      const url = editingId
        ? `/api/products/${editingId}`
        : "/api/products";

      const method = editingId
        ? "PATCH"
        : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save product"
        );
      }

      alert(
        editingId
          ? "Product updated successfully."
          : "Product added successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      fetchProducts();
    } catch (error) {
      console.error(
        "Product Save Error:",
        error
      );

      alert("Failed to save product.");
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete product"
        );
      }

      setProducts((prev) =>
        prev.filter(
          (product) => product._id !== id
        )
      );

      alert(
        "Product deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      alert("Failed to delete product.");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">
            ALVERIQ — Products
          </h1>

          <p className="mt-8 text-gray-500">
            Loading products...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              ALVERIQ — Products
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your products
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:opacity-80"
          >
            + Add Product
          </button>
        </div>

        {/* ========================= */}
        {/* ADD / EDIT FORM */}
        {/* ========================= */}

        {showForm && (
          <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border px-5 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            {/* BASIC DETAILS */}

            <div className="grid gap-5 md:grid-cols-2">

              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) =>
                  updateForm(
                    "name",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  updateForm(
                    "category",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  updateForm(
                    "price",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              <input
                type="number"
                placeholder="Old Price"
                value={form.oldPrice}
                onChange={(e) =>
                  updateForm(
                    "oldPrice",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Discount e.g. 20% OFF"
                value={form.discount}
                onChange={(e) =>
                  updateForm(
                    "discount",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              <input
                type="number"
                step="0.1"
                placeholder="Rating"
                value={form.rating}
                onChange={(e) =>
                  updateForm(
                    "rating",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              {/* MAIN IMAGE */}

              <input
                type="text"
                placeholder="Main Image URL"
                value={form.image}
                onChange={(e) =>
                  updateForm(
                    "image",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              {/* HOVER IMAGE */}

              <input
                type="text"
                placeholder="Hover Image URL"
                value={form.hoverImage}
                onChange={(e) =>
                  updateForm(
                    "hoverImage",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black"
              />

              {/* SIZES */}

              <input
                type="text"
                placeholder="Sizes: S, M, L, XL"
                value={form.sizes}
                onChange={(e) =>
                  updateForm(
                    "sizes",
                    e.target.value
                  )
                }
                className="rounded-xl border p-4 outline-none focus:border-black md:col-span-2"
              />

            </div>

            {/* DESCRIPTION */}

            <textarea
              rows={5}
              placeholder="Product Description"
              value={form.description}
              onChange={(e) =>
                updateForm(
                  "description",
                  e.target.value
                )
              }
              className="mt-5 w-full rounded-xl border p-4 outline-none focus:border-black"
            />

            {/* ========================= */}
            {/* PRODUCT GALLERY */}
            {/* ========================= */}

            <div className="mt-8 space-y-5 border-t pt-8">

              <div>
                <h3 className="text-xl font-bold">
                  Product Gallery
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add multiple product image URLs.
                </p>
              </div>

              {/* IMAGE PREVIEWS */}

              {form.images.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                  {form.images.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative overflow-hidden rounded-2xl border bg-gray-50"
                      >

                        <img
                          src={image}
                          alt={`Product image ${
                            index + 1
                          }`}
                          className="h-48 w-full object-cover"
                        />

                        <div className="absolute left-2 top-2 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
                          Image {index + 1}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeGalleryImage(
                              index
                            )
                          }
                          className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          Remove
                        </button>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
                  No gallery images added.
                </div>
              )}

              {/* ADD IMAGE */}

              <button
                type="button"
                onClick={addGalleryImage}
                className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                + Add Gallery Image
              </button>

            </div>

            {/* SAVE */}

            <button
              type="button"
              onClick={saveProduct}
              className="mt-8 w-full rounded-full bg-black py-4 font-semibold text-white transition hover:opacity-80"
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>
        )}

        {/* ========================= */}
        {/* PRODUCTS */}
        {/* ========================= */}

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-gray-500">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >

                {/* IMAGE */}

                <div className="h-72 overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* INFO */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold">
                      {product.name}
                    </h2>

                    {product.discount && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                        {product.discount}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {product.category}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xl font-bold">
                      ₹{product.price}
                    </span>

                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.oldPrice}
                      </span>
                    )}
                  </div>

                  {product.rating !== undefined && (
                    <p className="mt-3 text-sm">
                      ⭐ {product.rating}
                    </p>
                  )}

                  {product.sizes &&
                    product.sizes.length > 0 && (
                      <p className="mt-2 text-sm text-gray-500">
                        Sizes:{" "}
                        {product.sizes.join(", ")}
                      </p>
                    )}

                  {/* BUTTONS */}

                  <div className="mt-5 flex gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(product)
                      }
                      className="flex-1 rounded-full border px-4 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteProduct(
                          product._id
                        )
                      }
                      className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}