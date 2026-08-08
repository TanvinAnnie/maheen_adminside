import { NextRequest, NextResponse } from "next/server";
import {connectToDB} from "@/lib/connectToDB";
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

    if (!eyebrow || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Eyebrow, title and description are required",
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
      eyebrow,
      title,
      description,
      items,
      isPublished:
        typeof isPublished === "boolean" ? isPublished : true,
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

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create services",
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

    const {
      eyebrow,
      title,
      description,
      items,
      isPublished,
    } = body;

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

    if (eyebrow !== undefined) {
      service.eyebrow = eyebrow;
    }

    if (title !== undefined) {
      service.title = title;
    }

    if (description !== undefined) {
      service.description = description;
    }

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

      service.items = items;
    }

    if (typeof isPublished === "boolean") {
      service.isPublished = isPublished;
    }

    await service.save();

    return NextResponse.json(
      {
        success: true,
        message: "Services updated successfully",
        data: service,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update services",
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

    const service = await Service.findOneAndDelete();

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
    console.error("DELETE /api/services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete services",
        data: null,
      },
      { status: 500 }
    );
  }
}