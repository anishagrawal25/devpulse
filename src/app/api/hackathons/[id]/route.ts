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
    const { name, websiteUrl, regDeadline, submissionDeadline, teamName, status, prizeNotes, projectSummary } = body;

    const existing = await prisma.hackathon.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    const updated = await prisma.hackathon.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : existing.websiteUrl,
        teamName: teamName !== undefined ? teamName : existing.teamName,
        status: status !== undefined ? status : existing.status,
        prizeNotes: prizeNotes !== undefined ? prizeNotes : existing.prizeNotes,
        projectSummary: projectSummary !== undefined ? projectSummary : existing.projectSummary,
        regDeadline: regDeadline !== undefined ? (regDeadline ? new Date(regDeadline) : null) : existing.regDeadline,
        submissionDeadline: submissionDeadline !== undefined ? (submissionDeadline ? new Date(submissionDeadline) : null) : existing.submissionDeadline,
      },
      include: { milestones: true },
    });

    return NextResponse.json({ hackathon: updated });
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
    const existing = await prisma.hackathon.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    await prisma.hackathon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
