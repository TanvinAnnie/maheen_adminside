import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDB } from "@/lib/connectToDB";
import User from "@/lib/models/User";

export async function POST() {
  try {
    await connectToDB();

    const email = "admin@gmail.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists.",
        },
        {
          status: 400,
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully.",
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create Admin Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}