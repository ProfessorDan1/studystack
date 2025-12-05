import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import DashboardContent from "@/components/DashboardContent";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

export default async function DashboardPage() {
  const session: Session | null = await getServerSession(authOptions as any);

  if (!session || !session.user?.email) {
    return redirect("/"); // unauthenticated users go to landing page
  }

  const userId = session.user.id; // guaranteed by authOptions callback

  const courses = await prisma.course.findMany({
    where: {
      students: {
        some: { userId },
      },
    },
    orderBy: {
      courseCode: "asc",
    },
  });

  return <DashboardContent user={session.user} courses={courses} />;
}