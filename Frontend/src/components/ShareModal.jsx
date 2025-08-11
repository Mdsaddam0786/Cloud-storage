import React from 'react';

export default function ShareModal({ file, onClose }) {
  if (!file) return null;
  const link = `/api/files/${file._id}/download`;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Share File</h2>
        <input
          className="border p-2 rounded w-full mb-4"
          value={link}
          readOnly
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
