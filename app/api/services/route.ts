import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Service from "@/lib/models/Service";

// ======================================================
// GET — Fetch Services
// ======================================================

export async function GET() {
  try {
    await connectToDB();

    const service = await Service.findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Services content not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Services fetched successfully",
        data: service,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch services",
        data: null,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST — Create Services
// ======================================================

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();

    const {
      eyebrow,
      title,
      description,
      items,
      isPublished,
    } = body;

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
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Description is required",
          data: null,
        },
        { status: 400 }
      );
    }

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

    const existingService = await Service.findOne();

    if (existingService) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Services content already exists. Use PUT to update it.",
          data: existingService,
        },
        { status: 409 }
      );
    }

    const service = await Service.create({
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      description: description.trim(),
      items,
      isPublished:
        typeof isPublished === "boolean"
          ? isPublished
          : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Services created successfully",
        data: service,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/services error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown database error";

    return NextResponse.json(
      {
        success: false,
        message: `Failed to create services: ${errorMessage}`,
        data: null,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT — Update Services
// ======================================================

export async function PUT(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();

    console.log(
      "🔵 PUT /api/services body:",
      JSON.stringify(body, null, 2)
    );

    const {
      eyebrow,
      title,
      description,
      items,
      isPublished,
    } = body;

    // --------------------------------------------------
    // Find existing document
    // --------------------------------------------------

    const service = await Service.findOne();

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Services content not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Validate fields
    // --------------------------------------------------

    if (
      eyebrow !== undefined &&
      (typeof eyebrow !== "string" ||
        !eyebrow.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Eyebrow must be a non-empty string",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      title !== undefined &&
      (typeof title !== "string" ||
        !title.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Title must be a non-empty string",
          data: null,
        },
        { status: 400 }
      );
    }

    if (
      description !== undefined &&
      (typeof description !== "string" ||
        !description.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Description must be a non-empty string",
          data: null,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Update basic fields
    // --------------------------------------------------

    if (eyebrow !== undefined) {
      service.eyebrow = eyebrow.trim();
    }

    if (title !== undefined) {
      service.title = title.trim();
    }

    if (description !== undefined) {
      service.description = description.trim();
    }

    // --------------------------------------------------
    // Update items
    // --------------------------------------------------

    if (items !== undefined) {
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

      /*
       * Normalize the items before assigning them
       * to Mongoose.
       *
       * This prevents unnecessary/invalid properties
       * from being sent to the schema.
       */

      const normalizedItems = items.map(
        (
          item: Record<string, unknown>,
          index: number
        ) => ({
          ...(typeof item._id === "string"
            ? { _id: item._id }
            : {}),

          number:
            typeof item.number === "string"
              ? item.number
              : String(index + 1).padStart(2, "0"),

          title:
            typeof item.title === "string"
              ? item.title.trim()
              : "",

          image:
            typeof item.image === "string"
              ? item.image
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

      service.items = normalizedItems;
    }

    // --------------------------------------------------
    // Update publish status
    // --------------------------------------------------

    if (typeof isPublished === "boolean") {
      service.isPublished = isPublished;
    }

    // --------------------------------------------------
    // Save MongoDB document
    // --------------------------------------------------

    console.log(
      "🟡 Saving Services document..."
    );

    await service.save();

    console.log(
      "🟢 Services updated successfully:",
      (service._id as any).toString()
    );

    return NextResponse.json(
      {
        success: true,
        message: "Services updated successfully",
        data: service,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ PUT /api/services error:",
      error
    );

    /*
     * Return the ACTUAL error message during development.
     * This will tell us immediately if the problem is
     * Mongoose validation, casting, duplicate data, etc.
     */

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown database error";

    return NextResponse.json(
      {
        success: false,
        message: `Failed to update services: ${errorMessage}`,
        data: null,
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE — Delete Services
// ======================================================

export async function DELETE() {
  try {
    await connectToDB();

    const service =
      await Service.findOneAndDelete();

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Services content not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Services deleted successfully",
        data: service,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE /api/services error:",
      error
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown database error";

    return NextResponse.json(
      {
        success: false,
        message: `Failed to delete services: ${errorMessage}`,
        data: null,
      },
      { status: 500 }
    );
  }
}