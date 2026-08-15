import Razorpay from "razorpay";
import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

const razorpay =
  new Razorpay({
    key_id:
      process.env
        .NEXT_PUBLIC_RAZORPAY_KEY_ID!,

    key_secret:
      process.env
        .RAZORPAY_KEY_SECRET!,
  });

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const items =
      body.items;

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cart is empty",
        },
        { status: 400 }
      );
    }

    await connectDB();

    let subtotal = 0;

    const verifiedItems: any[] =
      [];

    for (const item of items) {
      if (!item.id) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Product ID is missing",
          },
          { status: 400 }
        );
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid quantity",
          },
          { status: 400 }
        );
      }

      const product =
        await Product.findById(
          item.id
        ).lean();

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Product not found",
          },
          { status: 404 }
        );
      }

      const productSizes =
        product.sizes || [];

      let selectedSize =
        item.size || "";

      if (
        productSizes.length > 0
      ) {
        if (!selectedSize) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Please select a size for ${product.name}`,
            },
            { status: 400 }
          );
        }

        if (
          !productSizes.includes(
            selectedSize
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Invalid size ${selectedSize}`,
            },
            { status: 400 }
          );
        }
      } else {
        selectedSize = "";
      }

      const price =
        Number(product.price);

      subtotal +=
        price * quantity;

      verifiedItems.push({
        id:
          product._id.toString(),

        name:
          product.name,

        image:
          product.image || "",

        price,

        quantity,

        size:
          selectedSize,
      });
    }

    const shipping =
      subtotal > 999 ? 0 : 99;

    const total =
      subtotal + shipping;

    const razorpayOrder =
      await razorpay.orders.create({
        amount:
          Math.round(
            total * 100
          ),

        currency: "INR",

        receipt:
          `receipt_${Date.now()}`,
      });

    return NextResponse.json({
      success: true,

      id:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      subtotal,

      shipping,

      total,

      items:
        verifiedItems,
    });
  } catch (error) {
    console.error(
      "Payment API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create payment order",
      },
      { status: 500 }
    );
  }
}