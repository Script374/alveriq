import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    // ========================================
    // LOGIN COOKIE
    // ========================================

    const cookieStore =
      await cookies();

    const userId =
      cookieStore.get(
        "alveriq_user"
      )?.value;

    // ========================================
    // NOT LOGGED IN
    // ========================================

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first",
          orders: [],
        },
        {
          status: 401,
        }
      );
    }

    // ========================================
    // VALIDATE USER ID
    // ========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid user session",
          orders: [],
        },
        {
          status: 401,
        }
      );
    }

    // ========================================
    // DATABASE
    // ========================================

    await connectDB();

    // ========================================
    // VERY IMPORTANT
    //
    // ONLY CURRENT LOGGED-IN USER
    // ========================================

    const orders =
      await Order.find({
        userId:
          new mongoose.Types.ObjectId(
            userId
          ),
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    // ========================================
    // DEBUG
    // ========================================

    console.log(
      "================================"
    );

    console.log(
      "MY ORDERS REQUEST"
    );

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "ORDERS FOUND:",
      orders.length
    );

    console.log(
      "================================"
    );

    // ========================================
    // SUCCESS
    // ========================================

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "My Orders API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch your orders",
        orders: [],
      },
      {
        status: 500,
      }
    );
  }
}