import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Products GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectDB();

    const product = await Product.create({
      name: body.name,
      price: Number(body.price),
      oldPrice: body.oldPrice
        ? Number(body.oldPrice)
        : undefined,
      image: body.image,
      hoverImage: body.hoverImage,
      category: body.category,
      sizes: body.sizes || [],
      rating: body.rating
        ? Number(body.rating)
        : 0,
      discount: body.discount,
      description: body.description,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Product Create Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}