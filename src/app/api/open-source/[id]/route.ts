import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-user";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { repoName, prTitle, prUrl, issueUrl, status, contributionType, description } = body;

    const existing = await prisma.openSourceEntry.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const wasMerged = existing.status === "MERGED";
    const isNowMerged = status === "MERGED";

    const updated = await prisma.openSourceEntry.update({
      where: { id },
      data: {
        repoName: repoName !== undefined ? repoName : existing.repoName,
        prTitle: prTitle !== undefined ? prTitle : existing.prTitle,
        prUrl: prUrl !== undefined ? prUrl : existing.prUrl,
        issueUrl: issueUrl !== undefined ? issueUrl : existing.issueUrl,
        status: status !== undefined ? status : existing.status,
        contributionType: contributionType !== undefined ? contributionType : existing.contributionType,
        description: description !== undefined ? description : existing.description,
        mergedAt: isNowMerged && !wasMerged ? new Date() : !isNowMerged ? null : existing.mergedAt,
      },
    });

    if (isNowMerged && !wasMerged) {
      await prisma.user.update({
        where: { id: user.id },
        data: { totalXp: { increment: 50 } },
      });
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          type: "PR_MERGED",
          description: `Merged PR "${updated.prTitle}" in ${updated.repoName} 🎉`,
        },
      });
    }

    return NextResponse.json({ entry: updated });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.openSourceEntry.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await prisma.openSourceEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
