"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Share2, Shield } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect to dashboard if signed in
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col justify-center">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-100/40 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v1.0 is now live for LASUED students
        </div>
         <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                A final year project 
            </p>
        
        {/* Hero Text */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          StudyStack <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            organize & share
          </span>
        </h1>

        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create course folders, upload course materials, past questions, 
          and access crowdsourced materials and past questions from top students right here. 
          <p className="text-lg font-medium text-indigo-900 bg-indigo-50/50 border border-indigo-100 rounded-xl py-2 px-4 inline-block">
                Lets create a collaborative learning environment together!
            </p>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
         <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-login-modal"))}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-black px-10 font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-95"
          >
            <span className="mr-2 text-lg">Start </span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          {/* <button className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900">
            View Demo
          </button> */}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            { icon: BookOpen, title: "Course Folders", desc: "Add courses and keep every materials and past questions in it." },
            { icon: Share2, title: "Easy Sharing", desc: "Collaborate with classmates by sharing resources instantly." },
            { icon: Shield, title: "Secure Archive", desc: "Never lose a file again. Your academic history, backed up safely." }
          ].map((feature, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}