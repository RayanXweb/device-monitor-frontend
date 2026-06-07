'use client';

import { useState, useEffect } from 'react';
import { 
  FiFolder, FiFile, FiDownload, FiTrash2, FiRefreshCw,
  FiArrowLeft, FiSearch, FiGrid, FiList, FiUpload,
  FiMusic, FiImage, FiVideo, FiFileText, FiArchive
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceFiles({ deviceId }) {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, [deviceId, currentPath]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/devices/${deviceId}/files?path=${encodeURIComponent(currentPath)}`);
      const data = await response.json();
      setFiles(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    setCurrentPath(path);
  };

  const goBack = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    setCurrentPath(parentPath);
  };

  const downloadFile = async (file) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/files/download?path=${encodeURIComponent(file.path)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const deleteFile = async (file) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return;
    
    try {
      await fetch(`/api/devices/${deviceId}/files?path=${encodeURIComponent(file.path)}`, {
        method: 'DELETE'
      });
      toast.success('File deleted');
      fetchFiles();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const uploadFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentPath);
    
    try {
      await fetch(`/api/devices/${deviceId}/files/upload`, {
        method: 'POST',
        body: formData
      });
      toast.success('File uploaded');
      fetchFiles();
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const getFileIcon = (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (file.isDirectory) return <FiFolder className="text-yellow-500" size={24} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <FiImage className="text-green-500" size={24} />;
    if (['mp4', 'avi', 'mkv', 'mov'].includes(ext)) return <FiVideo className="text-blue-500" size={24} />;
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return <FiMusic className="text-purple-500" size={24} />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FiArchive className="text-orange-500" size={24} />;
    if (['txt', 'md', 'json', 'xml'].includes(ext)) return <FiFileText className="text-gray-500" size={24} />;
    return <FiFile className="text-gray-500" size={24} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              disabled={currentPath === '/'}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
            >
              <FiArrowLeft size={20} />
            </button>
            <div className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              {currentPath}
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {viewMode === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
            </button>
            
            <label className="cursor-pointer">
              <input
                type="file"
                onChange={uploadFile}
                className="hidden"
              />
              <div className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <FiUpload /> Upload
              </div>
            </label>
            
            <button
              onClick={fetchFiles}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12">Loading files...</div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition cursor-pointer group"
                onDoubleClick={() => file.isDirectory && navigateTo(file.path)}
              >
                <div className="flex flex-col items-center text-center">
                  {getFileIcon(file)}
                  <div className="mt-2 text-sm font-medium truncate w-full">{file.name}</div>
                  {!file.isDirectory && (
                    <div className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                    {!file.isDirectory && (
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
                        className="p-1 bg-blue-600 rounded hover:bg-blue-700"
                      >
                        <FiDownload size={12} className="text-white" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteFile(file); }}
                      className="p-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      <FiTrash2 size={12} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Size</th>
                  <th className="px-4 py-2 text-left">Modified</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file, idx) => (
                  <tr
                    key={idx}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onDoubleClick={() => file.isDirectory && navigateTo(file.path)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file)}
                        <span>{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {!file.isDirectory ? formatFileSize(file.size) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {file.modified ? new Date(file.modified).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!file.isDirectory && (
                          <button
                            onClick={() => downloadFile(file)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <FiDownload size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteFile(file)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredFiles.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            No files found in this directory
          </div>
        )}
      </div>
    </div>
  );
         }
