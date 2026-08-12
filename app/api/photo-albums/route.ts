import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import PhotoAlbum from "@/lib/models/PhotoAlbum";

// ======================================================
// GET — Fetch Photo Albums
// ======================================================

export async function GET() {
  try {
    await connectToDB();

    const photoAlbum = await PhotoAlbum.findOne()
      .sort({ createdAt: -1 })
      .lean();

    // --------------------------------------------------
    // No document yet
    // --------------------------------------------------

    if (!photoAlbum) {
      return NextResponse.json(
        {
          success: true,
          message: "Photo albums content not created yet",
          data: null,
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------
    // Document found
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Photo albums fetched successfully",
        data: photoAlbum,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET /api/photo-albums error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch photo albums",
        data: null,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST — Create Photo Albums
// ======================================================

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();

    const {
      eyebrow,
      title,
      highlightedTitle,
      secondTitle,
      items,
      isPublished,
    } = body;

    // --------------------------------------------------
    // Validate basic fields
    // --------------------------------------------------

    if (
      typeof eyebrow !== "string" ||
      !eyebrow.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Eyebrow is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      typeof highlightedTitle !== "string" ||
      !highlightedTitle.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Highlighted title is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      typeof secondTitle !== "string" ||
      !secondTitle.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Second title is required",
          data: null,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate items
    // --------------------------------------------------

    if (!Array.isArray(items)) {
      return NextResponse.json(
        {
          success: false,
          message: "Items must be an array",
          data: null,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate each item
    // --------------------------------------------------

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      if (
        typeof item.title !== "string" ||
        !item.title.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Item ${index + 1} title is required`,
            data: null,
          },
          { status: 400 }
        );
      }

      if (
        typeof item.subtitle !== "string" ||
        !item.subtitle.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Item ${index + 1} subtitle is required`,
            data: null,
          },
          { status: 400 }
        );
      }

      if (
        typeof item.image !== "string" ||
        !item.image.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Item ${index + 1} image is required`,
            data: null,
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Normalize items
    // --------------------------------------------------

    const normalizedItems = items.map(
      (
        item: Record<string, unknown>,
        index: number
      ) => ({
        ...(typeof item._id === "string"
          ? {
              _id: item._id,
            }
          : {}),

        title:
          typeof item.title === "string"
            ? item.title.trim()
            : "",

        subtitle:
          typeof item.subtitle === "string"
            ? item.subtitle.trim()
            : "",

        image:
          typeof item.image === "string"
            ? item.image.trim()
            : "",

        order:
          typeof item.order === "number"
            ? item.order
            : index + 1,

        isActive:
          typeof item.isActive === "boolean"
            ? item.isActive
            : true,
      })
    );

    // --------------------------------------------------
    // Check existing document
    // --------------------------------------------------

    const existingPhotoAlbum =
      await PhotoAlbum.findOne();

    if (existingPhotoAlbum) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Photo albums content already exists. Use PUT to update it.",
          data: existingPhotoAlbum,
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // Create document
    // --------------------------------------------------

    const photoAlbum = await PhotoAlbum.create({
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      highlightedTitle:
        highlightedTitle.trim(),
      secondTitle: secondTitle.trim(),
      items: normalizedItems,
      isPublished:
        typeof isPublished === "boolean"
          ? isPublished
          : true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Photo albums created successfully",
        data: photoAlbum,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/photo-albums error:",
      error
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown database error";

    return NextResponse.json(
      {
        success: false,
        message:
          `Failed to create photo albums: ${errorMessage}`,
        data: null,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT — Create OR Update Photo Albums
// ======================================================

export async function PUT(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();

    console.log(
      "🔵 PUT /api/photo-albums body:",
      JSON.stringify(body, null, 2)
    );

    const {
      eyebrow,
      title,
      highlightedTitle,
      secondTitle,
      items,
      isPublished,
    } = body;

    // --------------------------------------------------
    // Validate basic fields
    // --------------------------------------------------

    if (
      typeof eyebrow !== "string" ||
      !eyebrow.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Eyebrow is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      typeof highlightedTitle !== "string" ||
      !highlightedTitle.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Highlighted title is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      typeof secondTitle !== "string" ||
      !secondTitle.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Second title is required",
          data: null,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate items
    // --------------------------------------------------

    if (!Array.isArray(items)) {
      return NextResponse.json(
        {
          success: false,
          message: "Items must be an array",
          data: null,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate each item
    // --------------------------------------------------

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      if (
        typeof item.title !== "string" ||
        !item.title.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Item ${index + 1} title is required`,
            data: null,
          },
          { status: 400 }
        );
      }

      if (
        typeof item.subtitle !== "string" ||
        !item.subtitle.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Item ${index + 1} subtitle is required`,
            data: null,
          },
          { status: 400 }
        );
      }

      if (
        typeof item.image !== "string" ||
        !item.image.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Item ${index + 1} image is required`,
            data: null,
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Normalize items
    // --------------------------------------------------

    const normalizedItems = items.map(
      (
        item: Record<string, unknown>,
        index: number
      ) => ({
        ...(typeof item._id === "string"
          ? {
              _id: item._id,
            }
          : {}),

        title:
          typeof item.title === "string"
            ? item.title.trim()
            : "",

        subtitle:
          typeof item.subtitle === "string"
            ? item.subtitle.trim()
            : "",

        image:
          typeof item.image === "string"
            ? item.image.trim()
            : "",

        order:
          typeof item.order === "number"
            ? item.order
            : index + 1,

        isActive:
          typeof item.isActive === "boolean"
            ? item.isActive
            : true,
      })
    );

    // --------------------------------------------------
    // Find existing document
    // --------------------------------------------------

    let photoAlbum =
      await PhotoAlbum.findOne();

    // ==================================================
    // FIRST SAVE — CREATE
    // ==================================================

    if (!photoAlbum) {
      console.log(
        "🟡 No Photo Albums document found. Creating..."
      );

      photoAlbum = await PhotoAlbum.create({
        eyebrow: eyebrow.trim(),
        title: title.trim(),
        highlightedTitle:
          highlightedTitle.trim(),
        secondTitle:
          secondTitle.trim(),
        items: normalizedItems,
        isPublished:
          typeof isPublished === "boolean"
            ? isPublished
            : true,
      });

      console.log(
        "🟢 Photo Albums created:",
        String(photoAlbum._id)
      );

      return NextResponse.json(
        {
          success: true,
          message:
            "Photo albums created successfully",
          data: photoAlbum,
        },
        { status: 201 }
      );
    }

    // ==================================================
    // EXISTING DOCUMENT — UPDATE
    // ==================================================

    console.log(
      "🟡 Existing Photo Albums found. Updating..."
    );

    photoAlbum.set(
      "eyebrow",
      eyebrow.trim()
    );

    photoAlbum.set(
      "title",
      title.trim()
    );

    photoAlbum.set(
      "highlightedTitle",
      highlightedTitle.trim()
    );

    photoAlbum.set(
      "secondTitle",
      secondTitle.trim()
    );

    photoAlbum.set(
      "items",
      normalizedItems
    );

    if (typeof isPublished === "boolean") {
      photoAlbum.set(
        "isPublished",
        isPublished
      );
    }

    await photoAlbum.save();

    console.log(
      "🟢 Photo Albums updated:",
      String(photoAlbum._id)
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Photo albums updated successfully",
        data: photoAlbum,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ PUT /api/photo-albums error:",
      error
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown database error";

    return NextResponse.json(
      {
        success: false,
        message:
          `Failed to save photo albums: ${errorMessage}`,
        data: null,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE — Delete Photo Albums
// ======================================================

export async function DELETE() {
  try {
    await connectToDB();

    const photoAlbum =
      await PhotoAlbum.findOneAndDelete();

    if (!photoAlbum) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Photo albums content not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Photo albums deleted successfully",
        data: photoAlbum,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE /api/photo-albums error:",
      error
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown database error";

    return NextResponse.json(
      {
        success: false,
        message:
          `Failed to delete photo albums: ${errorMessage}`,
        data: null,
      },
      { status: 500 }
    );
  }
}