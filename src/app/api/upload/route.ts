
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;
    const fileType = formData.get("fileType") as string;

    if (!file || !courseId || !fileType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    
  const arrayBuffer = await file.arrayBuffer();
const uint8 = new Uint8Array(arrayBuffer);

    const uploaded = await put(`studystack/${Date.now()}-${file.name}`, file, {
  access: "public",
});


    // Save to DB
    const saved = await prisma.file.create({
      data: {
        title: file.name,
        url: uploaded.url,
        fileType,
        courseId,
        uploaderId: session.user.id,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed", details: String(error) },
      { status: 500 }
    );
  }
}
