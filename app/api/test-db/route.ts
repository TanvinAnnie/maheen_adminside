import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";

export async function GET() {
  try {
    await connectToDB();

    return NextResponse.json({
      success: true,
      message: "Database Connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}