import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import Razorpay from "razorpay";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

// ========================================
// RAZORPAY SERVER INSTANCE
// ========================================

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ========================================
// CREATE ORDER
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
      paymentId,
      orderId,
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
    // PAYMENT DATA
    // ========================================

    if (
      typeof paymentId !== "string" ||
      !paymentId.trim() ||
      typeof orderId !== "string" ||
      !orderId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment details are missing",
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
    // PREVENT DUPLICATE ORDER
    // ========================================

    const existingOrder = await Order.findOne({
      orderId: orderId.trim(),
    }).lean();

    if (existingOrder) {
      // ----------------------------------------
      // SECURITY:
      // Existing order must belong to same user
      // ----------------------------------------

      if (existingOrder.userId.toString() !== userId) {
        return NextResponse.json(
          {
            success: false,
            message: "Order access denied",
          },
          {
            status: 403,
          }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Order already exists",
        order: existingOrder,
      });
    }

    // ========================================
    // VERIFY RAZORPAY ORDER
    // ========================================

    let razorpayOrder: any;

    try {
      razorpayOrder = await razorpay.orders.fetch(
        orderId.trim()
      );
    } catch (error) {
      console.error(
        "Razorpay Order Fetch Error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid Razorpay order",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // VERIFY RAZORPAY PAYMENT
    // ========================================

    let razorpayPayment: any;

    try {
      razorpayPayment =
        await razorpay.payments.fetch(
          paymentId.trim()
        );
    } catch (error) {
      console.error(
        "Razorpay Payment Fetch Error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid Razorpay payment",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // PAYMENT MUST BELONG TO THIS ORDER
    // ========================================

    if (
      razorpayPayment.order_id !==
      orderId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment does not belong to this order",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // PAYMENT STATUS
    // ========================================

    if (razorpayPayment.status !== "captured") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment has not been captured",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // PREPARE PRODUCTS
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
    // VERIFY RAZORPAY AMOUNT
    // ========================================

    const expectedAmount =
      Math.round(total * 100);

    const razorpayAmount =
      Number(
        razorpayOrder.amount
      );

    if (
      razorpayAmount !==
      expectedAmount
    ) {
      console.error(
        "AMOUNT MISMATCH",
        {
          expectedAmount,
          razorpayAmount,
          orderId,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount mismatch",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // VERIFY PAYMENT AMOUNT
    // ========================================

    if (
      Number(
        razorpayPayment.amount
      ) !== expectedAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment amount verification failed",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // VERIFY CURRENCY
    // ========================================

    if (
      razorpayOrder.currency !==
        "INR" ||
      razorpayPayment.currency !==
        "INR"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment currency",
        },
        {
          status: 400,
        }
      );
    }

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

        paymentMethod: "ONLINE",

        paymentId:
          paymentId.trim(),

        orderId:
          orderId.trim(),

        status: "Paid",
      });

    console.log(
      "================================"
    );

    console.log(
      "ORDER SAVED"
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
      "PAYMENT ID:",
      order.paymentId
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
        "Order created successfully",

      order:
        order.toObject(),
    });
  } catch (error: any) {
    console.error(
      "Order Save Error:",
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

// ========================================
// GET CURRENT USER ORDERS
// ========================================

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
    // ONLY CURRENT USER
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

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Orders Fetch Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch orders",
        orders: [],
      },
      {
        status: 500,
      }
    );
  }
}