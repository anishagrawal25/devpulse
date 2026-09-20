import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const entries = await prisma.openSourceEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/open-source error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { repoName, prTitle, prUrl, issueUrl, status, contributionType, description } = body;

    if (!repoName || !prTitle) {
      return NextResponse.json({ error: "Repo name and title are required" }, { status: 400 });
    }

    const entry = await prisma.openSourceEntry.create({
      data: {
        userId: user.id,
        repoName,
        prTitle,
        prUrl: prUrl || null,
        issueUrl: issueUrl || null,
        status: status || "OPEN",
        contributionType: contributionType || "Pull Request",
        description: description || null,
        mergedAt: status === "MERGED" ? new Date() : null,
      },
    });

    const xpBonus = status === "MERGED" ? 60 : 30;
    await prisma.user.update({
      where: { id: user.id },
      data: { totalXp: { increment: xpBonus } },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: status === "MERGED" ? "PR_MERGED" : "PR_OPENED",
        description: `${status === "MERGED" ? "Merged" : "Opened"} contribution "${prTitle}" in ${repoName} 🚀`,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/open-source error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
