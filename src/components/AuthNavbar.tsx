// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { signOut } from "next-auth/react";
// import Image from "next/image";
// import { 
//   LogOut, 
//   LayoutDashboard, 
//   Settings, 
//   ChevronDown, 
//   Layers,
//   User as UserIcon
// } from "lucide-react";

// interface NavbarProps {
//   user: {
//     name?: string | null;
//     email?: string | null;
//     image?: string | null;
//   };
// }

// export default function AuthNavbar({ user }: NavbarProps) {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowDropdown(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     await signOut({ callbackUrl: "/" });
//   };

//   return (
//     <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo Section */}
//           <Link href="/dashboard" className="group flex items-center gap-3">
//             <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
//               <Layers size={20} strokeWidth={2.5} />
//             </div>
//             <span className="font-bold text-xl text-slate-900 tracking-tight">
//               StudyStack
//             </span>
//           </Link>

//           {/* Profile Dropdown Section */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className={`
//                 flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all duration-200
//                 ${showDropdown 
//                   ? "bg-slate-50 border-indigo-200 ring-2 ring-indigo-500/10" 
//                   : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
//                 }
//               `}
//             >
//               {/* Avatar */}
//               <div className="relative h-9 w-9 rounded-full overflow-hidden bg-indigo-100 flex-shrink-0 border border-slate-100">
//                 {user.image ? (
//                   <Image
//                     src={user.image}
//                     alt={user.name || "User"}
//                     fill
//                     className="object-cover"
//                   />
//                 ) : (
//                   <div className="h-full w-full flex items-center justify-center text-indigo-600 font-bold text-sm">
//                     {user.name?.charAt(0).toUpperCase() || "U"}
//                   </div>
//                 )}
//               </div>

//               {/* Name & Chevron (Hidden on mobile) */}
//               <div className="hidden sm:flex items-center gap-2">
//                 <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
//                   {user.name || "Student"}
//                 </span>
//                 <ChevronDown 
//                   size={14} 
//                   className={`text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} 
//                 />
//               </div>
//             </button>

//             {/* Dropdown Menu */}
//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                
//                 {/* User Info Header */}
//                 <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
//                   <p className="text-sm font-semibold text-slate-900 truncate">
//                     {user.name || "User"}
//                   </p>
//                   <p className="text-xs text-slate-500 truncate mt-0.5">
//                     {user.email}
//                   </p>
//                 </div>

//                 <div className="p-2 space-y-1">
//                   <Link
//                     href="/dashboard"
//                     onClick={() => setShowDropdown(false)}
//                     className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
//                   >
//                     <LayoutDashboard size={16} className="text-slate-400 group-hover:text-indigo-500" />
//                     Dashboard
//                   </Link>
                  
//                   <Link
//                     href="/profile"
//                     onClick={() => setShowDropdown(false)}
//                     className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
//                   >
//                     <UserIcon size={16} className="text-slate-400 group-hover:text-indigo-500" />
//                     Profile
//                   </Link>

//                   <Link
//                     href="/settings"
//                     onClick={() => setShowDropdown(false)}
//                     className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
//                   >
//                     <Settings size={16} className="text-slate-400 group-hover:text-indigo-500" />
//                     Settings
//                   </Link>
//                 </div>

//                 <div className="p-2 border-t border-slate-100">
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <LogOut size={16} />
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ChevronDown, 
  Layers,
  User as UserIcon
} from "lucide-react";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AuthNavbar({ user }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Spacer Element to push content down below the fixed navbar */}
      <div className="h-32 w-full" aria-hidden="true" />

      {/* Floating Wrapper - z-50 ensures it's on top of everything */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* Dark Island Nav */}
        <nav className="pointer-events-auto flex items-center justify-between gap-4 bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] rounded-full px-5 py-2.5 w-full max-w-5xl transition-all">
          
          {/* Logo Section */}
          <Link href="/dashboard" className="flex items-center gap-3 group shrink-0">
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:rotate-12 select-none">
              <Layers size={18} strokeWidth={2.5} />
            </div>
            {/* Text is now always visible (removed hidden sm:block) and selectable */}
            <span className="font-bold text-lg text-white tracking-tight select-text">
              StudyStack
            </span>
          </Link>

          {/* Right Side: Navigation Links + Profile */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1 mr-2">
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Dashboard
                </Link>
                {/* Added 'pointer-events-auto' explicitly to links to ensure clickability */}
                <Link href="/browse" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Browse
                </Link>
            </div>

            {/* Profile Dropdown Section */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`
                  flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border transition-all duration-200 group
                  ${showDropdown 
                    ? "bg-white/10 border-white/20" 
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-indigo-500/20 border border-white/10 shadow-inner group-hover:border-white/30 transition-colors shrink-0">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-indigo-300 font-bold text-xs select-none">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Name & Chevron */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate hidden sm:block select-none">
                    {user.name?.split(' ')[0] || "Student"}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} 
                  />
                </div>
              </button>

              {/* Dark Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1a1a1a] rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200 z-50">
                  
                  {/* User Info Header */}
                  <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-gray-500" />
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <UserIcon size={16} className="text-gray-500" />
                      Profile
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <Settings size={16} className="text-gray-500" />
                      Settings
                    </Link>
                  </div>

                  <div className="p-2 border-t border-white/5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}