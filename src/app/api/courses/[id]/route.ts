import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function DELETE(
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

    const courseId = params.id;

    // Check if user is enrolled in the course
    const enrollment = await prisma.courseUser.findFirst({
      where: {
        courseId,
        userId: user.id,
      }
    });

    if (!enrollment) {
      return NextResponse.json({ 
        error: "You are not enrolled in this course" 
      }, { status: 403 });
    }

    // Get all files where user is just an owner (not original uploader)
    // These are files they added from others - delete only these
    const filesToRemove = await prisma.file.findMany({
      where: { 
        courseId,
        uploaderId: user.id,
        originalUploaderId: { not: user.id } // Only files they didn't originally upload
      }
    });

    // Delete only the files user added from others (not their original uploads)
    await prisma.file.deleteMany({
      where: { 
        courseId,
        uploaderId: user.id,
        originalUploaderId: { not: user.id }
      }
    });

    // Remove user's enrollment
    await prisma.courseUser.delete({
      where: { 
        id: enrollment.id 
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "You have been removed from the course. Your uploaded files have been deleted."
    });
  } catch (error: any) {
    console.error("Leave course error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to leave course" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}