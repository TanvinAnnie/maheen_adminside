import { NextRequest, NextResponse } from "next/server";

import {connectToDB} from "@/lib/connectToDB";
import Hero from "@/lib/models/Hero";

/* =========================================================
   GET SINGLE HERO
   GET /api/hero/:id
========================================================= */

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectToDB();

    const { id } = await context.params;

    const hero = await Hero.findById(id).lean();

    if (!hero) {
      return NextResponse.json(
        {
          success: false,
          message: "Hero not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Hero fetched successfully",
        data: hero,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET SINGLE HERO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch hero",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   UPDATE HERO
   PUT /api/hero/:id
========================================================= */

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectToDB();

    const { id } = await context.params;

    const body = await request.json();

    const {
      slides,
      isPublished,
    } = body;

    /* -----------------------------------------------------
       Find Hero
    ----------------------------------------------------- */

    const hero = await Hero.findById(id);

    if (!hero) {
      return NextResponse.json(
        {
          success: false,
          message: "Hero not found",
        },
        { status: 404 }
      );
    }

    /* -----------------------------------------------------
       Update Fields
    ----------------------------------------------------- */

    if (slides !== undefined) {
      hero.slides = slides;
    }

    if (isPublished !== undefined) {
      hero.isPublished = isPublished;
    }

    /* -----------------------------------------------------
       Save
    ----------------------------------------------------- */

    await hero.save();

    return NextResponse.json(
      {
        success: true,
        message: "Hero updated successfully",
        data: hero,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE HERO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update hero",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE HERO
   DELETE /api/hero/:id
========================================================= */

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await connectToDB();

    const { id } = await context.params;

    const hero = await Hero.findByIdAndDelete(id);

    if (!hero) {
      return NextResponse.json(
        {
          success: false,
          message: "Hero not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Hero deleted successfully",
        data: hero,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE HERO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete hero",
      },
      { status: 500 }
    );
  }
}