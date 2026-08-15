import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

// ========================================
// CREATE COD ORDER
// ========================================

export async function POST(req: Request) {
  try {
    // ========================================
    // LOGIN USER
    // ========================================

    const cookieStore = await cookies();

    const userId = cookieStore.get("alveriq_user")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        {
          status: 401,
        }
      );
    }

    // ========================================
    // VALIDATE USER ID
    // ========================================

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user session",
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

    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
    } = body;

    // ========================================
    // SHIPPING VALIDATION
    // ========================================

    if (
      !customerName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing shipping details",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // PINCODE
    // ========================================

    if (!/^\d{6}$/.test(pincode.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pincode",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // ITEMS
    // ========================================

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order items are required",
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
    // CHECK USER
    // ========================================

    const user = await User.findById(userId)
      .select("_id email name")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // ========================================
    // PREPARE PRODUCTS
    // (same validation as Razorpay flow —
    // server price/size/quantity are the
    // source of truth, never trust the client)
    // ========================================

    const orderItems: {
      id: string;
      name: string;
      image: string;
      price: number;
      quantity: number;
      size: string;
    }[] = [];

    for (const item of items) {
      // ----------------------------------------
      // QUANTITY
      // ----------------------------------------

      const quantity = Number(item.quantity);

      if (
        !item.id ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product quantity",
          },
          {
            status: 400,
          }
        );
      }

      // ----------------------------------------
      // FIND PRODUCT
      // ----------------------------------------

      let product: any = null;

      // MongoDB _id
      if (
        mongoose.Types.ObjectId.isValid(
          String(item.id)
        )
      ) {
        product =
          await Product.findById(
            item.id
          ).lean();
      }

      // Custom product id
      if (!product) {
        product =
          await Product.findOne({
            id: String(item.id),
          }).lean();
      }

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Product not found: ${item.id}`,
          },
          {
            status: 404,
          }
        );
      }

      // ----------------------------------------
      // SIZE
      // ----------------------------------------

      const productSizes =
        product.sizes || [];

      let selectedSize =
        item.size || "";

      if (productSizes.length > 0) {
        if (!selectedSize) {
          return NextResponse.json(
            {
              success: false,
              message:
                `Please select a size for ${product.name}`,
            },
            {
              status: 400,
            }
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
                `Invalid size ${selectedSize} for ${product.name}`,
            },
            {
              status: 400,
            }
          );
        }
      } else {
        selectedSize = "";
      }

      // ----------------------------------------
      // SERVER PRODUCT PRICE
      // ----------------------------------------

      const price = Number(
        product.price
      );

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Invalid price for ${product.name}`,
          },
          {
            status: 500,
          }
        );
      }

      // ----------------------------------------
      // FINAL ORDER ITEM
      // ----------------------------------------

      orderItems.push({
        id: product._id.toString(),

        name: product.name,

        image: product.image || "",

        price,

        quantity,

        size: selectedSize,
      });
    }

    // ========================================
    // VALID ORDER ITEMS
    // ========================================

    if (orderItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid products found",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // SERVER-SIDE PRICE CALCULATION
    // ========================================

    const subtotal =
      orderItems.reduce(
        (sum, item) =>
          sum +
          item.price *
            item.quantity,
        0
      );

    const shipping =
      subtotal > 999
        ? 0
        : 99;

    const total =
      subtotal + shipping;

    // ========================================
    // GENERATE COD ORDER ID
    // (no Razorpay order exists for COD,
    // so we generate our own unique id)
    // ========================================

    const codOrderId = `COD-${randomUUID()}`;

    // ========================================
    // CREATE ORDER
    // ========================================

    const order =
      await Order.create({
        userId: user._id,

        customerName:
          customerName.trim(),

        email:
          email.trim().toLowerCase(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        city:
          city.trim(),

        state:
          state.trim(),

        pincode:
          pincode.trim(),

        items:
          orderItems,

        total,

        paymentMethod: "COD",

        paymentId: "COD",

        orderId: codOrderId,

        // COD order — payment collected on
        // delivery, so it starts as Pending
        // (not Paid, unlike Razorpay orders)
        status: "Pending",
      });

    console.log(
      "================================"
    );

    console.log(
      "COD ORDER SAVED"
    );

    console.log(
      "USER ID:",
      user._id.toString()
    );

    console.log(
      "ORDER ID:",
      order.orderId
    );

    console.log(
      "TOTAL:",
      order.total
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
        "COD order placed successfully",

      order:
        order.toObject(),
    });
  } catch (error: any) {
    console.error(
      "COD Order Save Error:",
      error
    );

    // ========================================
    // DUPLICATE ORDER PROTECTION
    // ========================================

    if (
      error?.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order has already been processed",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to save order",
      },
      {
        status: 500,
      }
    );
  }
}