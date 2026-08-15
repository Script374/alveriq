import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment verification data is missing",
        },
        { status: 400 }
      );
    }

    const secret =
      process.env
        .RAZORPAY_KEY_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Razorpay secret is not configured",
        },
        { status: 500 }
      );
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Payment verified successfully",
    });
  } catch (error) {
    console.error(
      "Payment Verify Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Payment verification failed",
      },
      { status: 500 }
    );
  }
}