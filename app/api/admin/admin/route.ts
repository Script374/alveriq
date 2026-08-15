import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

const allowedStatuses = [
  "Pending",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

export async function PATCH(req: Request) {
  try {
    // ========================================
    // ADMIN SESSION
    // ========================================

    const cookieStore = await cookies();

    /*
      IMPORTANT:
      Yahan apne existing admin-login cookie ka
      exact naam use karna hai.

      Example:
      const adminSession =
        cookieStore.get("alveriq_admin")?.value;
    */

    const adminSession =
      cookieStore.get("alveriq_admin")?.value;

    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required",
        },
        {
          status: 401,
        }
      );
    }

    // ========================================
    // REQUEST BODY
    // ========================================

    const body = await req.json();

    const orderId =
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : "";

    // ========================================
    // VALIDATION
    // ========================================

    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order ID and status are required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedStatuses.includes(
        status as OrderStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // DATABASE
    // ========================================

    await connectDB();

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
            status: status as OrderStatus,
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
        {
          status: 404,
        }
      );
    }

    // ========================================
    // LOG
    // ========================================

    console.log(
      "================================"
    );

    console.log(
      "ADMIN ORDER STATUS UPDATED"
    );

    console.log(
      "ORDER ID:",
      order.orderId
    );

    console.log(
      "NEW STATUS:",
      order.status
    );

    console.log(
      "================================"
    );

    // ========================================
    // SUCCESS
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
      {
        status: 500,
      }
    );
  }
}