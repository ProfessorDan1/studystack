"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import LoginModal from "@/components/LoginModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-login-modal", handler);
    return () => window.removeEventListener("open-login-modal", handler);
  }, []);

  return (
    <>
      {/* Floating Wrapper 
        - pointer-events-none ensures clicks pass through the empty space around the nav 
      */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* The "Dark Island" Navbar 
          - bg-gray-900/90: Dark background for high contrast against white page
          - backdrop-blur-xl: sophisticated glass effect
          - shadow-2xl: Deep shadow to lift it off the page
          - border-white/10: Subtle light border to define edges
        */}
        <nav className="pointer-events-auto flex items-center justify-between gap-6 sm:gap-12 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] rounded-full px-4 pl-5 py-2.5 w-full max-w-xl transition-all hover:scale-[1.02] hover:bg-[#1a1a1a]">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Logo Icon */}
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:rotate-12">
              <Layers size={16} strokeWidth={3} />
            </div>
            {/* Text - White for contrast */}
            <span className="font-bold text-lg text-white tracking-tight">
              StudyStack
            </span>
          </Link>

          {/* Action Button */}
          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-5 py-2 rounded-full font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-white/10"
          >
            <span>Sign In</span>
            <ArrowRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>

        </nav>
      </div>

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}