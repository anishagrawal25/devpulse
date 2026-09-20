import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execAsync("node prisma/seed.js");
    console.log("Seed API triggered:", stdout);
    return NextResponse.json({
      message: "Database successfully reseeded with fresh demo data!",
      output: stdout,
    });
  } catch (error: any) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { error: "Failed to reseed database", details: error.message },
      { status: 500 }
    );
  }
}
