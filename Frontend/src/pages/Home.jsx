import React, { useEffect, useState } from 'react';
import api from '../api';
import UploadArea from '../components/UploadArea';
import FileExplorer from '../components/FileExplorer';
import ShareModal from '../components/ShareModal';
import axios from 'axios';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [shareFile, setShareFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/files/${id}`);
      if (res.data.success) {
        setFiles((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('❌ Failed to delete file.');
    }
  };

  const handleRename = async (file) => {
    const newName = prompt('Rename file:', file.fileName);
    if (newName?.trim()) {
      try {
        await api.patch(`/files/${file._id}/rename`, { newName });
        fetchFiles();
      } catch (err) {
        console.error('Rename error:', err);
        setError('❌ Failed to rename file.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  // Fetch files once
  const fetchFiles = async () => {
    try {
      const res = await api.get('http://localhost:5000/api/files');
      const allFiles = res.data || [];
      setFiles(allFiles);

      const pending = allFiles.filter(
        (file) => !file.tags || file.tags.length === 0,
      );
      setPendingFiles(pending);

      if (pending.length > 0) {
        console.log(
          '⏳ Still pending tags for files:',
          pending.map((f) => f.fileName),
        );
      } else {
        console.log('✅ All files have AI tags!');
      }

      return allFiles; // ✅ return data so initLoad() can use it
    } catch (err) {
      console.error('❌ Error fetching files:', err);
      return []; // ✅ avoid undefined
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh logic with debug + timeout
  useEffect(() => {
    let intervalId;
    let startTime = Date.now();

    const initLoad = async () => {
      setLoading(true);
      const data = await fetchFiles();

      const hasPendingTags = data.some(
        (f) => !f.ai_tags || f.ai_tags.length === 0,
      );
      if (hasPendingTags) {
        console.log('⏳ Starting auto-refresh: Some files are missing AI tags');

        intervalId = setInterval(async () => {
          console.log('🔄 Auto-refreshing files to check for AI tags...');
          const updated = await fetchFiles();
          const pendingFiles = updated.filter(
            (f) => !f.ai_tags || f.ai_tags.length === 0,
          );

          if (pendingFiles.length) {
            console.log(
              '⏳ Still pending tags for files:',
              pendingFiles.map((f) => f.fileName),
            );
          }

          const stillPending = pendingFiles.length > 0;
          const elapsedSeconds = (Date.now() - startTime) / 1000;

          if (!stillPending) {
            clearInterval(intervalId);
            console.log('✅ All tags ready — stopped auto-refresh');
          } else if (elapsedSeconds > 120) {
            // stop after 2 min
            clearInterval(intervalId);
            console.warn(
              '⚠️ Stopped auto-refresh after 2 minutes — some files never got tags',
            );
          }
        }, 10000); // 10s
      }
    };

    initLoad();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-semibold text-gray-800">
          ☁️ Saddam&apos;s Cloud Storage
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Error Toast */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
            <button
              onClick={() => setError('')}
              className="absolute top-1 right-2 text-red-500 hover:text-red-700">
              &times;
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white p-4 rounded shadow">
          <UploadArea onUpload={fetchFiles} />
        </div>

        {/* File List */}
        <div className="bg-white rounded shadow p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
              <span className="ml-3 text-gray-500">Loading files...</span>
            </div>
          ) : files.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No files uploaded yet.
            </p>
          ) : (
            <>
              <div className="mb-2 text-sm text-gray-600">
                Showing {files.length} file{files.length > 1 ? 's' : ''}
              </div>
              <FileExplorer
                files={files}
                onDelete={handleDelete}
                onRename={handleRename}
                onShare={setShareFile}
              />
            </>
          )}
        </div>

        {/* Share Modal */}
        <ShareModal
          file={shareFile}
          onClose={() => setShareFile(null)}
        />
      </main>
    </div>
  );
}
