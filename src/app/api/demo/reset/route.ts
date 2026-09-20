import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execAsync("node prisma/seed.js");
    console.log("Demo reset output:", stdout);
    return NextResponse.json({
      success: true,
      message: "Demo account successfully reset to original showcase state!",
    });
  } catch (error: any) {
    console.error("POST /api/demo/reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset demo dataset", details: error.message },
      { status: 500 }
    );
  }
}
