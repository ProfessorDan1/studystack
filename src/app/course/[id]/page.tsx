import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CourseContent from "@/components/CourseContent";
import { Session } from "next-auth";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session: Session | null = await getServerSession(authOptions as any);

  if (!session || !session.user?.email) {
    return redirect("/");
  }

  const userId = session.user.id;

  // Fetch course with files
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      files: {
        include: {
          uploader: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      students: {
        where: { userId },
      },
    },
  });

  if (!course) {
    return redirect("/dashboard");
  }

  // Check if user is enrolled
  if (course.students.length === 0) {
    return redirect("/dashboard");
  }

  return (
    <CourseContent
      user={session.user}
      course={{
        id: course.id,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
      }}
      files={course.files}
    />
  );
}