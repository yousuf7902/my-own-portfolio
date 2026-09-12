import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const achievements = await Achievement.find().sort({ order: 1 });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    const achievement = await Achievement.create(data);
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    const { _id, ...updateData } = data;

    const achievement = await Achievement.findByIdAndUpdate(_id, updateData, { new: true });
    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await Achievement.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
