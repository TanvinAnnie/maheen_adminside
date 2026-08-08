import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    /* =====================================================
       GET FORM DATA
    ===================================================== */

    const formData = await request.formData();

    const file = formData.get("file");

    /* =====================================================
       CHECK FILE
    ===================================================== */

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No image file provided",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       CHECK FILE TYPE
    ===================================================== */

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       CHECK FILE SIZE
       Maximum: 5MB
    ===================================================== */

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5MB",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       CONVERT FILE TO BUFFER
    ===================================================== */

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    /* =====================================================
       CONVERT BUFFER TO DATA URI
    ===================================================== */

    const base64 = buffer.toString("base64");

    const dataUri = `data:${file.type};base64,${base64}`;

    /* =====================================================
       UPLOAD TO CLOUDINARY
    ===================================================== */

    const uploadResult = await cloudinary.uploader.upload(
      dataUri,
      {
        folder: "maheen-accessories/hero",

        resource_type: "image",

        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      }
    );

    /* =====================================================
       RETURN RESULT
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",

        data: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image",
      },
      { status: 500 }
    );
  }
}