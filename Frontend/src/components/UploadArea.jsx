import React, { useState } from 'react';
import api from '../api';

export default function UploadArea({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      onUpload();
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="flex-1 border rounded px-2 py-1"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </div>
  );
}
