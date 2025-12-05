import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fileId = params.id;

    // Get the original file
    const originalFile = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!originalFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check if user already has this file (by URL and courseId)
    const existingFile = await prisma.file.findFirst({
      where: {
        url: originalFile.url,
        courseId: originalFile.courseId,
        uploaderId: user.id,
      }
    });

    if (existingFile) {
      return NextResponse.json({ 
        error: "You already have this file in your collection" 
      }, { status: 400 });
    }

    // Create a copy for the user (same Supabase file, new DB record)
    const newFile = await prisma.file.create({
      data: {
        title: originalFile.title,
        url: originalFile.url, // Same Supabase URL - no duplicate storage
        fileType: originalFile.fileType,
        size: originalFile.size,
        category: originalFile.category,
        uploaderId: user.id, // New owner
        originalUploaderId: originalFile.originalUploaderId || originalFile.uploaderId, // Preserve original uploader
        courseId: originalFile.courseId,
      }
    });

    return NextResponse.json({ success: true, file: newFile });
  } catch (error: any) {
    console.error("Add file error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to add file" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}