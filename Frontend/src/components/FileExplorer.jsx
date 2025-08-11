import React from 'react';

export default function FileExplorer({
  files = [],
  onDelete,
  onRename,
  onShare,
}) {
  if (!Array.isArray(files) || files.length === 0)
    return <p className="text-gray-500">No files uploaded yet.</p>;

  return (
    <div className="bg-white shadow-md rounded p-4">
      {files.map((f) => (
        <div
          key={f._id}
          className="flex justify-between items-center border-b py-3">
          {/* File Info */}
          <div>
            {/* File Name */}
            <div className="font-medium text-gray-800">{f.fileName}</div>

            {/* AI Tags */}
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              {f.ai_tags && f.ai_tags.length > 0 ? (
                f.ai_tags.map((tag) => (
                  <span
                    key={`${f._id}-${tag}`}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-300">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="flex items-center text-gray-400 italic text-xs">
                  <svg
                    className="animate-spin h-3 w-3 mr-1 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  AI tags pending...
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-x-2 flex-shrink-0">
            <button
              onClick={() => onShare(f)}
              className="bg-indigo-500 hover:bg-indigo-700 text-white py-1 px-3 rounded">
              Share
            </button>
            <button
              onClick={() => onRename(f)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded">
              Rename
            </button>
            <button
              onClick={() => onDelete(f._id)}
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
