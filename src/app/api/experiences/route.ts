import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const experiences = await Experience.find().sort({ order: 1 });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
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
    const experience = await Experience.create(data);
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
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

    const experience = await Experience.findByIdAndUpdate(_id, updateData, { new: true });
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
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

    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
