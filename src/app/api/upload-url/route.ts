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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Get session server-side
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file") as File;
    const courseId = form.get("courseId") as string;
    const category = form.get("category") as string || "material";

    // Validation
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    // Look up user by session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Optional: Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only PDF, DOC, DOCX, and images allowed" 
      }, { status: 400 });
    }

    // Optional: Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 10MB" 
      }, { status: 400 });
    }

    // Extract file metadata
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fileType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("files")
      .upload(fileName, fileBuffer, {
        upsert: false,
        contentType: fileType,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ 
        error: `Storage error: ${error.message}` 
      }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("files")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Save to database
    const savedFile = await prisma.file.create({
      data: {
        title: file.name,
        fileType,
        size: file.size,
        url: publicUrl,
        uploaderId: user.id,
        originalUploaderId: user.id, // Track original uploader
        courseId,
        category,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      file: savedFile,
    });
  } catch (error: any) {
    console.error("Upload route error:", error);
    return NextResponse.json({ 
      error: error.message || "Upload failed" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}