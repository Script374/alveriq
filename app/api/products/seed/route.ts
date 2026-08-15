import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const products = [
  {
    id: "1",
    name: "Classic White Shirt",
    price: 1999,
    oldPrice: 2599,
    image: "/images/products/p1.jpg",
    hoverImage: "/images/products/p1-hover.jpg",
    images: [
      "/images/products/p1.jpg",
      "/images/products/p1-hover.jpg",
      "/images/products/p1-2.jpg",
      "/images/products/p1-3.jpg",
    ],
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    discount: "20% OFF",
    description:
      "Crafted from premium cotton with a luxury finish. Designed for modern everyday wear.",
  },

  {
    id: "2",
    name: "Black Oversized Tee",
    price: 999,
    oldPrice: 1499,
    image: "/images/products/p2.jpg",
    hoverImage: "/images/products/p2-hover.jpg",
    images: [
      "/images/products/p2.jpg",
      "/images/products/p2-hover.jpg",
      "/images/products/p2-2.jpg",
      "/images/products/p2-3.jpg",
    ],
    category: "T-Shirts",
    sizes: ["M", "L", "XL"],
    rating: 4.7,
    discount: "33% OFF",
    description:
      "Oversized premium cotton t-shirt with relaxed fit.",
  },

  {
    id: "3",
    name: "Blue Denim Shirt",
    price: 1799,
    oldPrice: 2299,
    image: "/images/products/p3.jpg",
    hoverImage: "/images/products/p3-hover.jpg",
    images: [
      "/images/products/p3.jpg",
      "/images/products/p3-hover.jpg",
      "/images/products/p3-2.jpg",
      "/images/products/p3-3.jpg",
    ],
    category: "Shirts",
    sizes: ["S", "M", "L"],
    rating: 4.9,
    discount: "22% OFF",
    description:
      "Premium denim shirt with luxury stitching.",
  },

  {
    id: "4",
    name: "Olive Cargo Pants",
    price: 2499,
    oldPrice: 3199,
    image: "/images/products/p4.jpg",
    hoverImage: "/images/products/p4-hover.jpg",
    images: [
      "/images/products/p4.jpg",
      "/images/products/p4-hover.jpg",
      "/images/products/p4-2.jpg",
      "/images/products/p4-3.jpg",
    ],
    category: "Pants",
    sizes: ["L", "XL"],
    rating: 4.6,
    discount: "18% OFF",
    description:
      "Premium cargo pants with modern tapered fit.",
  },
];

export async function GET() {
  try {
    await connectDB();

    const existingProducts = await Product.countDocuments();

    if (existingProducts > 0) {
      return NextResponse.json({
        success: false,
        message: "Products already exist. Import skipped.",
      });
    }

    const insertedProducts =
      await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: `${insertedProducts.length} products imported successfully.`,
      products: insertedProducts,
    });
  } catch (error) {
    console.error("Product Seed Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to import products.",
      },
      {
        status: 500,
      }
    );
  }
}