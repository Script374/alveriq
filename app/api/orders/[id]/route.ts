import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(
  req: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    let orderId = params?.orderId;

    // Fallback: agar params se orderId na mile, URL path se nikal lo
    if (!orderId) {
      const url = new URL(req.url);
      const segments = url.pathname.split("/").filter(Boolean);
      orderId = segments[segments.length - 1];
    }

    const cleanOrderId = decodeURIComponent(
      orderId || ""
    ).trim();

    if (!cleanOrderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({
      orderId: cleanOrderId,
    }).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      order: {
        _id: order._id.toString(),

        orderId: order.orderId,

        customerName: order.customerName || "",

        email: order.email || "",

        phone: order.phone || "",

        address: order.address || "",

        city: order.city || "",

        state: order.state || "",

        pincode: order.pincode || "",

        total: Number(order.total || 0),

        // Fallback for orders created before
        // paymentMethod field existed
        paymentMethod:
          order.paymentMethod ||
          (order.orderId?.startsWith("COD")
            ? "COD"
            : "ONLINE"),

        paymentId: order.paymentId || "",

        status: order.status || "Pending",

        createdAt: order.createdAt || null,

        updatedAt: order.updatedAt || null,
      },
    });
  } catch (error) {
    console.error(
      "Track Order API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while tracking your order.",
      },
      { status: 500 }
    );
  }
}