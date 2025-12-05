"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

interface UploadModalProps {
   category: string;
  courseId: string;
  onSuccess?: () => void;
}

export default function UploadModal({ courseId, onSuccess }: UploadModalProps) {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!session?.user?.email) {
      setError("You must be logged in to upload");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);
      formData.append("userEmail", session.user.email); // Send email instead

      const res = await fetch("/api/upload-url", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      alert("Uploaded successfully!");
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <div>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError(null);
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={upload}
          disabled={loading || !file}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
            hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
  );
}