import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import About from "@/models/About";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    let about = await About.findOne();

    if (!about) {
      // Return default data if nothing in DB yet
      about = {
        greeting: "Hi,",
        greetingSuffix: "Myself",
        firstName: "Yousuf",
        lastName: "Hassan",
        roles: [
          "Competitive Programmer",
          "Software Engineer",
          "Programming Enthusiast",
          "Ready to explore new things",
        ],
        heroBio:
          "I have a strong background in problem-solving through programming, data-structure and algorithms, competitive programming, and have experience in mentoring at University Programming Wing where I guide beginners in solving programming problems.",
        aboutText:
          "I am currently pursuing a Bachelor of Science degree in Computer Science and Engineering at the International University of Business Agriculture and Technology(IUBAT).",
        email: "yousufhassan04@gmail.com",
        resumeLink:
          "https://drive.google.com/file/d/14l0fF6ctxpnQiwiYRSCDmKpo1uaSoYPx/view?usp=sharing",
        profileImage: "/images/myself.jpg",
        socials: {
          facebook: "https://www.facebook.com/yousuf.hassan.7902/",
          linkedin: "https://www.linkedin.com/in/yousuf-hassan-7902",
          github: "https://github.com/yousuf7902/",
          email: "yousufhassan04@gmail.com",
        },
      };
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 }
    );
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

    let about = await About.findOne();

    if (about) {
      Object.assign(about, data);
      await about.save();
    } else {
      about = await About.create(data);
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json(
      { error: "Failed to update about data" },
      { status: 500 }
    );
  }
}
