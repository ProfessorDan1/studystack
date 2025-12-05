'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface AddCourseModalProps {
  onAdded?: () => void;
  onClose: () => void;
}

export default function AddCourseModal({ onAdded, onClose }: AddCourseModalProps) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    
    if (!code.trim()) {
      alert('Please enter a course code');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/course', { 
        courseCode: code.toUpperCase().trim(), 
        courseTitle: title.trim() 
      });
      
      setCode('');
      setTitle('');
      if (onAdded) onAdded();
    } catch (e) {
      console.error(e);
      alert('Failed to add course');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 relative">
        
        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Course</h2>
            <p className="text-gray-500 text-sm mt-1">Create a folder to organize your materials.</p>
          </div>

          <form onSubmit={addCourse} className="flex flex-col gap-5">
            
            {/* Course Code */}
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-semibold text-gray-700 ml-1">
                Course Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="CSC301"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-mono text-lg placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase"
                />
              </div>
            </div>

            {/* Course Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-gray-700 ml-1">
                Course Title 
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Stuctured Programming"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Footer / Buttons */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="flex-[2] px-4 py-3 rounded-xl font-semibold text-white bg-gray-900 hover:bg-black hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Course"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}