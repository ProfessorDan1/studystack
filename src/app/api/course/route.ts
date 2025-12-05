import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { normalizeCourseCode } from '@/utils/normalizeCourseCode';

export async function GET() {
  const courses = await prisma.course.findMany({ orderBy: { courseCode: 'asc' } });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const rawCode = body.courseCode as string;
  const courseTitle = body.courseTitle as string | undefined;
  const normalized = normalizeCourseCode(rawCode);

  if (!normalized) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  // 1. Try to find existing course
  let course = await prisma.course.findFirst({ where: { courseCode: normalized } });

  if (!course) {
    // 2. Create if it doesn't exist
    course = await prisma.course.create({
      data: { 
        courseCode: normalized, 
        courseTitle: courseTitle || null, 
        createdAt: new Date() 
      },
    });
  } else if (courseTitle && courseTitle.trim() !== "") {
    // 3. FIX: If course exists but user provided a title, update it!
    // This handles cases where the course was created previously without a title
    course = await prisma.course.update({
      where: { id: course.id },
      data: { courseTitle: courseTitle }
    });
  }

  // 4. Link user to course
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  if (user) {
    try {
      await prisma.courseUser.create({ 
        data: { userId: user.id, courseId: course.id } 
      });
    } catch (e) {
      // already linked, ignore
    }
  }

  return NextResponse.json(course);
}