"use client";

import React, { useState } from "react";
import Link from "next/link";
import AddCourseModal from "./AddCourseModal";
import AuthNavbar from "./AuthNavbar";

interface Course {
  id: string;
  courseCode: string;
  courseTitle?: string | null;
}

interface DashboardContentProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  courses: Course[];
}

// Helper to generate a consistent gradient based on a string (course code)
const getCourseGradient = (str: string) => {
  const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const gradients = [
    "from-blue-600 to-indigo-700",
    "from-emerald-500 to-teal-700",
    "from-orange-500 to-red-600",
    "from-violet-600 to-purple-700",
    "from-cyan-600 to-blue-700",
    "from-rose-500 to-pink-700",
    "from-amber-500 to-orange-600",
    "from-slate-600 to-gray-700"
  ];
  return gradients[hash % gradients.length];
};

export default function DashboardContent({ user, courses }: DashboardContentProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navbar */}
      <AuthNavbar user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back, {user.name?.split(" ")[0] || "Student"} 👋
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              You have added <span className="font-semibold text-gray-900">{courses.length}</span> {courses.length === 1 ? 'course' : 'courses'}.
            </p>
          </div>
          
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all duration-200 px-6 py-3 rounded-xl font-medium shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            Add Course
          </button>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="flex justify-center mt-12">
            <div className="max-w-md w-full p-10 text-center border-dashed border-2 border-gray-200 rounded-3xl bg-white/50">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    No course yet
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    Create your first course folder to start organizing materials.
                  </p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Create Course Folder
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`} className="group block h-full outline-none">
                <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                  
                  {/* Compact Gradient Header */}
                  <div className={`h-24 bg-gradient-to-r ${getCourseGradient(course.courseCode)} p-5 relative flex flex-col justify-end`}>
                    <div className="absolute top-0 right-0 p-3 opacity-20">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                        <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" opacity="0.5"/>
                        <path d="M14 2l4 4L7 17H3v-4L14 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-wide relative z-10 font-mono">
                      {course.courseCode}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-grow">
                    <h4 className="font-semibold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {course.courseTitle || "Untitled Course"}
                    </h4>
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 border-t border-gray-50 mt-auto pt-4">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                            Manage Files
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Custom Modal */}
      {showModal && (
        <AddCourseModal
          onClose={() => setShowModal(false)}
          onAdded={() => {
            setShowModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}