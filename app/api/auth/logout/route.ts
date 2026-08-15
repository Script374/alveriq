import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear user cookie
    cookieStore.set("alveriq_user", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    // Clear role cookie
    cookieStore.set("alveriq_role", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      {
        status: 500,
      }
    );
  }
}