import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

const allowedStatuses = [
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export async function PATCH(req: Request) {
  try {
    // ========================================
    // GET LOGIN COOKIE
    // ========================================

    const cookieStore = await cookies();

    const userId =
      cookieStore.get("alveriq_user")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    // ========================================
    // CONNECT DATABASE
    // ========================================

    await connectDB();

    // ========================================
    // GET ACTUAL USER FROM DATABASE
    // ========================================

    const user = await User.findById(userId)
      .select("name email role")
      .lean();

    console.log("================================");
    console.log("ADMIN STATUS UPDATE");
    console.log("USER ID:", userId);
    console.log("USER:", user);
    console.log("DATABASE ROLE:", user?.role);
    console.log("================================");

    // ========================================
    // CHECK USER
    // ========================================

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    // ========================================
    // CHECK ACTUAL DATABASE ROLE
    // ========================================

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
          debug: {
            userId,
            email: user.email,
            role: user.role,
          },
        },
        { status: 403 }
      );
    }

    // ========================================
    // GET REQUEST BODY
    // ========================================

    const body = await req.json();

    const orderId =
      String(body.orderId || "").trim();

    const status =
      String(body.status || "").trim();

    // ========================================
    // VALIDATE
    // ========================================

    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order ID and status are required",
        },
        { status: 400 }
      );
    }

    if (
      !allowedStatuses.includes(
        status as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 }
      );
    }

    // ========================================
    // UPDATE ORDER
    // ========================================

    const order =
      await Order.findOneAndUpdate(
        {
          orderId,
        },
        {
          $set: {
            status,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    // ========================================
    // ORDER NOT FOUND
    // ========================================

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // ========================================
    // SUCCESS LOG
    // ========================================

    console.log("================================");
    console.log("ORDER STATUS UPDATED");
    console.log("ADMIN:", user.email);
    console.log("ORDER ID:", order.orderId);
    console.log("NEW STATUS:", order.status);
    console.log("================================");

    // ========================================
    // RESPONSE
    // ========================================

    return NextResponse.json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Order Status Update Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update order status",
      },
      { status: 500 }
    );
  }
}