import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/connectToDB";
import Product from "@/lib/models/Product";

export async function GET() {
  try {
    await connectToDB();

    const products = await Product.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get Products Error:", error);

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

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      image,
      category,
      featured,
      isActive,
    } = body;

    if (!name || !slug || !price || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields are missing.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct = await Product.findOne({
      slug,
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug already exists.",
        },
        {
          status: 400,
        }
      );
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      image,
      category,
      featured,
      isActive,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        data: product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create Product Error:", error);

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