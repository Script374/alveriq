import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// ========================================
// GET ALL ORDERS FOR ADMIN
// ========================================

export async function GET() {
  try {
    await connectDB();

    // ========================================
    // ADMIN:
    // Yahan userId se orders filter nahi karne hain.
    // Saare orders MongoDB se fetch honge.
    // ========================================

    const orders = await Order.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(
      "================================"
    );

    console.log(
      "ADMIN ORDERS FETCHED:",
      orders.length
    );

    console.log(
      "================================"
    );

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Admin Orders Fetch Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch admin orders",
        orders: [],
      },
      {
        status: 500,
      }
    );
  }
}