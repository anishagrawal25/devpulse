import { NextResponse } from "next/server";
import { generateLearningRoadmap } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/get-user";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      careerGoal = user?.careerGoal || "Full Stack Developer",
      experienceLevel = user?.careerLevel || "Beginner",
      targetWeeks = 4,
      focusAreas = "",
      customApiKey = "",
    } = body;

    const generated = await generateLearningRoadmap(
      careerGoal,
      experienceLevel,
      targetWeeks,
      focusAreas,
      customApiKey
    );

    return NextResponse.json({ roadmap: generated });
  } catch (error) {
    console.error("POST /api/roadmaps/generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
