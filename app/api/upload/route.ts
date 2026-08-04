import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    console.log("===== Upload Started =====");

    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Selected File:", file.name);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Uploading to Cloudinary...");

    const result: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "maheen-products",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Error:", error);
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error("Cloudinary returned no result."));
              return;
            }

            console.log(
              "Cloudinary Success:",
              result.secure_url
            );

            resolve(result);
          }
        );

        stream.end(buffer);
      }
    );

    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}