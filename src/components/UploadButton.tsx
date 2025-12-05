"use client";

export default function UploadButton() {
  return (
    <button
      onClick={() => alert("Open upload modal (client)")}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      + Upload File
    </button>
  );
}
