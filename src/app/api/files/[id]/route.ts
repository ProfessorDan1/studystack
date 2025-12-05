import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const fileId = params.id;

    // Get file from database
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check if user is the original uploader (only they can delete from storage)
    const isOriginalUploader = (file.originalUploaderId || file.uploaderId) === user.id;
    
    if (!isOriginalUploader && file.uploaderId !== user.id) {
      return NextResponse.json({ 
        error: "You cannot delete this file" 
      }, { status: 403 });
    }

    // If user is just an owner (not original uploader), only delete their DB record
    if (!isOriginalUploader) {
      await prisma.file.delete({
        where: { id: fileId }
      });
      return NextResponse.json({ 
        success: true, 
        message: "File removed from your collection" 
      });
    }

    // If original uploader, check if others have this file
    const otherUsersWithFile = await prisma.file.count({
      where: {
        url: file.url,
        id: { not: fileId },
      }
    });

    // Delete from Supabase only if no one else has it
    if (otherUsersWithFile === 0) {
      const urlParts = file.url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error: storageError } = await supabase.storage
        .from("files")
        .remove([fileName]);

      if (storageError) {
        console.error("Supabase delete error:", storageError);
      }
    } else {
      // Just delete all DB records for this user's upload
      await prisma.file.deleteMany({
        where: {
          url: file.url,
          originalUploaderId: user.id,
        }
      });
      
      return NextResponse.json({ 
        success: true,
        message: "File deleted. Others who saved it can still access it."
      });
    }

    // Delete from database
    await prisma.file.delete({
      where: { id: fileId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to delete file" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}