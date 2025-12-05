// "use client";

// import React, { useState, useMemo } from "react";
// import Link from "next/link";
// import AuthNavbar from "./AuthNavbar";
// import UploadModal from "./UploadModal";
// import {
//   Settings,
//   Eye,
//   Download,
//   Trash2,
//   Plus,
//   FileText,
//   Image as ImageIcon,
//   Paperclip,
//   File,
//   Search,
//   ArrowLeft,
//   X,
//   BookmarkPlus,
//   BookmarkCheck,
// } from "lucide-react";

// interface FileData {
//   id: string;
//   title: string;
//   fileType: string;
//   size: number;
//   url: string;
//   createdAt: Date;
//   uploaderId: string;
//   category: string;
//   uploader: {
//     name: string | null;
//     email: string | null;
//     image: string | null;
//   };
// }

// interface CourseContentProps {
//   user: {
//     id: string;
//     name?: string | null;
//     email?: string | null;
//     image?: string | null;
//   };
//   course: {
//     id: string;
//     courseCode: string;
//     courseTitle?: string | null;
//   };
//   files: FileData[];
// }

// type TabType = "material" | "pastQuestion";
// type ViewMode = "mine" | "others";

// export default function CourseContent({ user, course, files }: CourseContentProps) {
//   // State
//   const [activeTab, setActiveTab] = useState<TabType>("material");
//   const [viewMode, setViewMode] = useState<ViewMode>("mine");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showSettingsMenu, setShowSettingsMenu] = useState(false);
//   const [previewFile, setPreviewFile] = useState<FileData | null>(null);
//   const [loadingAction, setLoadingAction] = useState<string | null>(null);

//   // Memoized filtered files for better performance
//   const filteredFiles = useMemo(() => {
//     return files.filter(f => {
//       const matchesTab = f.category === activeTab;
//       const isOwner = f.uploaderId === user.id;
      
//       let matchesViewMode = false;
//       if (viewMode === "mine") matchesViewMode = isOwner;
//       else if (viewMode === "others") matchesViewMode = !isOwner;
      
//       const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesTab && matchesViewMode && matchesSearch;
//     });
//   }, [files, activeTab, viewMode, searchQuery, user.id]);

//   // Count badges
//   const counts = useMemo(() => {
//     const materialMine = files.filter(f => f.category === "material" && f.uploaderId === user.id).length;
//     const materialOthers = files.filter(f => f.category === "material" && f.uploaderId !== user.id).length;
    
//     const questionMine = files.filter(f => f.category === "pastQuestion" && f.uploaderId === user.id).length;
//     const questionOthers = files.filter(f => f.category === "pastQuestion" && f.uploaderId !== user.id).length;
    
//     return { materialMine, materialOthers, questionMine, questionOthers };
//   }, [files, user.id]);

//   // Formatting Utilities
//   const formatFileSize = (bytes: number) => {
//     if (bytes < 1024) return bytes + " B";
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//     return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//   };

//   const formatDate = (date: Date) => {
//     const d = new Date(date);
//     const now = new Date();
//     const diffMs = now.getTime() - d.getTime();
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
    
//     return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
//   };

//   const getFileIcon = (fileType: string) => {
//     if (fileType.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />;
//     if (fileType.includes("image")) return <ImageIcon className="w-8 h-8 text-purple-500" />;
//     if (fileType.includes("word") || fileType.includes("document")) return <File className="w-8 h-8 text-blue-500" />;
//     return <Paperclip className="w-8 h-8 text-gray-400" />;
//   };

//   const truncateFileName = (name: string, maxLength: number = 35) => {
//     if (name.length <= maxLength) return name;
//     const extension = name.split('.').pop();
//     const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
//     const truncated = nameWithoutExt.substring(0, maxLength - 3 - (extension?.length || 0));
//     return `${truncated}...${extension}`;
//   };

//   // Handlers with loading states
//   const handleDelete = async (fileId: string) => {
//     if (!confirm("Are you sure you want to delete this file?")) return;
//     setLoadingAction(fileId);
//     try {
//       const res = await fetch(`/api/files/${fileId}`, { method: "DELETE" });
//       if (res.ok) {
//         window.location.reload();
//       } else {
//         alert("Failed to delete file");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Error deleting file");
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   const handleAddFile = async (fileId: string) => {
//     setLoadingAction(fileId);
//     try {
//       const res = await fetch(`/api/files/${fileId}/add`, { method: "POST" });
//       const data = await res.json();
//       if (res.ok) {
//         window.location.reload();
//       } else {
//         alert(data.error || "Failed to add file");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Error adding file");
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   const handlePreview = (file: FileData) => {
//     if (file.fileType.includes("pdf") || file.fileType.includes("image")) {
//       window.open(file.url, "_blank");
//     } else {
//       setPreviewFile(file);
//     }
//   };

//   const handleLeaveCourse = async () => {
//     if (confirm("Leave this course? You'll lose access but your uploads will remain for others.")) {
//       try {
//         const res = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
//         if (res.ok) {
//           window.location.href = "/dashboard";
//         } else {
//           const data = await res.json();
//           alert(data.error || "Failed to leave course");
//         }
//       } catch (e) {
//         console.error(e);
//         alert("Error leaving course");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
//       <AuthNavbar user={user} />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header Section */}
//         <div className="mb-8">
//           <Link
//             href="/dashboard"
//             className="text-gray-500 hover:text-gray-900 text-sm font-medium mb-4 inline-flex items-center transition-colors group"
//           >
//             <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
//             Back to Dashboard
//           </Link>
          
//           <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//             <div>
//               <div className="flex items-center gap-3 flex-wrap">
//                 <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
//                   {course.courseCode}
//                 </h1>
//                 <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-semibold shadow-sm">
//                   {files.length} Files
//                 </span>
//               </div>
//               <p className="text-gray-600 mt-2 text-lg">
//                 {course.courseTitle || "Course Repository"}
//               </p>
//             </div>
            
//             {/* Settings Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowSettingsMenu(!showSettingsMenu)}
//                 className="p-2.5 hover:bg-white rounded-xl transition-all text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200 hover:shadow-sm"
//               >
//                 <Settings className="w-5 h-5" />
//               </button>

//               {showSettingsMenu && (
//                 <>
//                   <div className="fixed inset-0 z-10" onClick={() => setShowSettingsMenu(false)} />
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
//                     <button
//                       className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
//                       onClick={() => {
//                         alert("Edit feature coming soon");
//                         setShowSettingsMenu(false);
//                       }}
//                     >
//                       <Settings className="w-4 h-4" />
//                       Edit Course Details
//                     </button>
//                     <div className="h-px bg-gray-100 my-1" />
//                     <button
//                       className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-3"
//                       onClick={() => {
//                         handleLeaveCourse();
//                         setShowSettingsMenu(false);
//                       }}
//                     >
//                       <X className="w-4 h-4" />
//                       Leave Course
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab("material")}
//               className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
//                 activeTab === "material"
//                   ? "text-blue-600 bg-blue-50/50"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//             >
//               Course Materials
//               {activeTab === "material" && (
//                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
//               )}
//             </button>
//             <button
//               onClick={() => setActiveTab("pastQuestion")}
//               className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
//                 activeTab === "pastQuestion"
//                   ? "text-blue-600 bg-blue-50/50"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`}
//             >
//               Past Questions
//               {activeTab === "pastQuestion" && (
//                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
//               )}
//             </button>
//           </div>

//           {/* View Mode Pills & Controls */}
//           <div className="p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-gray-50/50">
//             <div className="flex gap-2 flex-wrap">
//               <button
//                 onClick={() => setViewMode("mine")}
//                 className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
//                   viewMode === "mine"
//                     ? "bg-white text-gray-900 shadow-sm border border-gray-200"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
//                 }`}
//               >
//                 My Files
//                 <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
//                   {activeTab === "material" ? counts.materialMine : counts.questionMine}
//                 </span>
//               </button>
//               <button
//                 onClick={() => setViewMode("others")}
//                 className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
//                   viewMode === "others"
//                     ? "bg-white text-gray-900 shadow-sm border border-gray-200"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
//                 }`}
//               >
//                 Repository
//                 <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
//                   {activeTab === "material" ? counts.materialOthers : counts.questionOthers}
//                 </span>
//               </button>
//             </div>

//             <div className="flex items-center gap-3">
//               {/* Search Bar */}
//               <div className="relative flex-grow md:flex-grow-0">
//                 <input
//                   type="text"
//                   placeholder="Search files..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                 />
//                 <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
//                 {searchQuery && (
//                   <button
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               {/* Upload Button */}
//               <button
//                 onClick={() => setShowUploadModal(true)}
//                 className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
//               >
//                 <Plus className="w-4 h-4" />
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content Grid */}
//         {filteredFiles.length === 0 ? (
//           <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
//             <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
//               <File className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No files found</h3>
//             <p className="text-gray-500 text-sm max-w-sm mx-auto">
//               {searchQuery
//                 ? "Try adjusting your search terms or browse other sections."
//                 : `No ${activeTab === "material" ? "materials" : "past questions"} in ${
//                     viewMode === "mine" ? "your uploads" : "the repository"
//                   } yet.`}
//             </p>
//             {viewMode === "mine" && !searchQuery && (
//               <button
//                 onClick={() => setShowUploadModal(true)}
//                 className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
//               >
//                 Upload Your First File
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//             {filteredFiles.map((file) => {
//               const isOwner = file.uploaderId === user.id;
//               const isLoading = loadingAction === file.id;

//               return (
//                 <div
//                   key={file.id}
//                   className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300 shadow-sm">
//                       {getFileIcon(file.fileType)}
//                     </div>
                    
//                     {/* Actions Menu */}
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => handlePreview(file)}
//                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                         title="Preview"
//                         disabled={isLoading}
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
                      
//                       <a
//                         href={file.url}
//                         download
//                         className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
//                         title="Download"
//                       >
//                         <Download className="w-4 h-4" />
//                       </a>

//                       {viewMode === "others" && !isOwner && (
//                         <button
//                           onClick={() => handleAddFile(file.id)}
//                           className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50"
//                           title="Add to my files"
//                           disabled={isLoading}
//                         >
//                           {isLoading ? (
//                             <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
//                           ) : (
//                             <Plus className="w-4 h-4" />
//                           )}
//                         </button>
//                       )}

//                       {isOwner && (
//                         <button
//                           onClick={() => handleDelete(file.id)}
//                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
//                           title="Delete"
//                           disabled={isLoading}
//                         >
//                           {isLoading ? (
//                             <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                           ) : (
//                             <Trash2 className="w-4 h-4" />
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mt-auto">
//                     <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2" title={file.title}>
//                       {file.title}
//                     </h3>
                    
//                     <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
//                       <div className="flex items-center gap-2">
//                         <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
//                           {file.uploader.name?.charAt(0).toUpperCase() || "?"}
//                         </div>
//                         <span className="truncate max-w-[100px] font-medium">
//                           {isOwner ? "You" : file.uploader.name || "Anonymous"}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-400">
//                         <span>{formatFileSize(file.size)}</span>
//                         <span>•</span>
//                         <span>{formatDate(file.createdAt)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </main>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-in zoom-in-95 duration-200">
//             <button
//               onClick={() => setShowUploadModal(false)}
//               className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <div className="p-8">
//               <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Upload {activeTab === "material" ? "Material" : "Past Question"}
//                 </h2>
//                 <p className="text-gray-500 text-sm mt-1">
//                   Select a file to add to this course repository.
//                 </p>
//               </div>
//               <UploadModal
//                 courseId={course.id}
//                 category={activeTab}
//                 onSuccess={() => {
//                   setShowUploadModal(false);
//                   window.location.reload();
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Preview Modal */}
//       {previewFile && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//               <div>
//                 <h3 className="font-semibold text-gray-900 text-lg">{previewFile.title}</h3>
//                 <p className="text-xs text-gray-500 mt-1">Document Preview</p>
//               </div>
//               <button
//                 onClick={() => setPreviewFile(null)}
//                 className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex-1 bg-gray-100 p-3">
//               <iframe
//                 src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewFile.url)}&embedded=true`}
//                 className="w-full h-full rounded-xl border border-gray-200 bg-white shadow-inner"
//                 title="Document Preview"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import AuthNavbar from "./AuthNavbar";
import UploadModal from "./UploadModal";
import {
  Settings,
  Eye,
  Download,
  Trash2,
  Plus,
  FileText,
  Image as ImageIcon,
  Paperclip,
  File,
  Search,
  ArrowLeft,
  X,
  Library,
} from "lucide-react";

interface FileData {
  id: string;
  title: string;
  fileType: string;
  size: number;
  url: string;
  createdAt: Date;
  uploaderId: string;
  category: string;
  uploader: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface CourseContentProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  course: {
    id: string;
    courseCode: string;
    courseTitle?: string | null;
  };
  files: FileData[];
}

type TabType = "material" | "pastQuestion";

export default function CourseContent({ user, course, files }: CourseContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("material");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRepositoryModal, setShowRepositoryModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Filter only user's files for main view
  const myFiles = useMemo(() => {
    return files.filter(f => 
      f.category === activeTab && f.uploaderId === user.id
    ).filter(f => 
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, activeTab, user.id, searchQuery]);

  // Others' files for repository
  const othersFiles = useMemo(() => {
    return files.filter(f => 
      f.category === activeTab && f.uploaderId !== user.id
    );
  }, [files, activeTab, user.id]);

  // Count for badge
  const myFilesCount = files.filter(f => f.uploaderId === user.id).length;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />;
    if (fileType.includes("image")) return <ImageIcon className="w-8 h-8 text-purple-500" />;
    if (fileType.includes("word") || fileType.includes("document")) return <File className="w-8 h-8 text-blue-500" />;
    return <Paperclip className="w-8 h-8 text-gray-400" />;
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Delete this file from your folder?")) return;
    setLoadingAction(fileId);
    try {
      const res = await fetch(`/api/files/${fileId}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting file");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddFile = async (fileId: string) => {
    setLoadingAction(fileId);
    try {
      const res = await fetch(`/api/files/${fileId}/add`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert("File added to your folder!");
        window.location.reload();
      } else {
        alert(data.error || "Failed to add file");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding file");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePreview = (file: FileData) => {
    if (file.fileType.includes("pdf") || file.fileType.includes("image")) {
      window.open(file.url, "_blank");
    } else {
      setPreviewFile(file);
    }
  };

  const handleLeaveCourse = async () => {
    if (confirm("Delete this course? Your uploads will remain for others.")) {
      try {
        const res = await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
        if (res.ok) {
          window.location.href = "/dashboard";
        } else {
          const data = await res.json();
          alert(data.error || "Failed to delete course");
        }
      } catch (e) {
        console.error(e);
        alert("Error deleting course");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <AuthNavbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-gray-900 text-sm font-medium mb-4 inline-flex items-center transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  {course.courseCode}
                </h1>
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-semibold shadow-sm">
                  {myFilesCount} Files
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-lg">
                {course.courseTitle || "Course Repository"}
              </p>
            </div>
            
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2.5 hover:bg-white rounded-xl transition-all text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200 hover:shadow-sm"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettingsMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSettingsMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      onClick={() => {
                        alert("Edit feature coming soon");
                        setShowSettingsMenu(false);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Edit Course Details
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-3"
                      onClick={() => {
                        handleLeaveCourse();
                        setShowSettingsMenu(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                      Delete Course
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("material")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === "material"
                  ? "text-blue-600 bg-blue-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Course Materials
              {activeTab === "material" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("pastQuestion")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === "pastQuestion"
                  ? "text-blue-600 bg-blue-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Past Questions
              {activeTab === "pastQuestion" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          {/* Action Bar */}
          <div className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-gray-50/50">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search your files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRepositoryModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow"
              >
                <Library className="w-4 h-4" />
                Browse other files
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* My Files Grid */}
        {myFiles.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <File className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              {searchQuery
                ? "No files match your search. Try different keywords."
                : `Upload your first ${activeTab === "material" ? "material" : "past question"} or browse the repository to add existing files.`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                Upload File
              </button>
              <button
                onClick={() => setShowRepositoryModal(true)}
                className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold transition-all"
              >
                Browse Repository
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {myFiles.map((file) => {
              const isLoading = loadingAction === file.id;

              return (
                <div
                  key={file.id}
                  className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-sm">
                      {getFileIcon(file.fileType)}
                    </div>
                    
                    {/* Always visible action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePreview(file)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <a
                        href={file.url}
                        download
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Delete"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2" title={file.title}>
                    {file.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Upload {activeTab === "material" ? "Material" : "Past Question"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Add a new file to your collection
                </p>
              </div>
              <UploadModal
                courseId={course.id}
                category={activeTab}
                onSuccess={() => {
                  setShowUploadModal(false);
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Repository Modal */}
      {showRepositoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Library className="w-6 h-6 text-blue-600" />
                  Course Repository
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Browse and add files from your coursemates.
                </p>
              </div>
              <button
                onClick={() => setShowRepositoryModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {othersFiles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Library className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Repository is empty
                  </h3>
                  <p className="text-gray-500 text-sm">
                    No files have been shared by other students yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    {/* <Plus className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> */}
                    <div className="text-sm text-blue-900">
                      <p className="font-medium">Click the <span className="font-bold">+</span> button to add files to your collection</p>
                      <p className="text-blue-700 mt-1">Added files will appear in your main view</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {othersFiles.map((file) => {
                      const isLoading = loadingAction === file.id;

                      return (
                        <div
                          key={file.id}
                          className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-100">
                              {getFileIcon(file.fileType)}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handlePreview(file)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Preview"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleAddFile(file.id)}
                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all disabled:opacity-50"
                                title="Add to my files"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2" title={file.title}>
                            {file.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.createdAt)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{previewFile.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Document Preview</p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-3">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewFile.url)}&embedded=true`}
                className="w-full h-full rounded-xl border border-gray-200 bg-white shadow-inner"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}