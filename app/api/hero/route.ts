import { NextRequest, NextResponse } from "next/server";

import {connectToDB} from "@/lib/connectToDB";
import Hero from "@/lib/models/Hero";

/* =========================================================
   GET ALL HERO
   GET /api/hero
========================================================= */

export async function GET() {
  try {
    await connectToDB();

    const heroes = await Hero.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Heroes fetched successfully",
        data: heroes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET HERO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch heroes",
        data: [],
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   CREATE HERO
   POST /api/hero
========================================================= */

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();

    const {
      slides = [],
      isPublished = true,
    } = body;

    /* -----------------------------------------------------
       Create Hero
    ----------------------------------------------------- */

    const hero = await Hero.create({
      slides,
      isPublished,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Hero created successfully",
        data: hero,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE HERO ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create hero",
      },
      { status: 500 }
    );
  }
}