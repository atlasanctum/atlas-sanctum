import React, { useState } from 'react';
import { File, Folder, Upload, Download, Trash2, Search, Grid, List, MoreVertical, FileText, Image, Video, Music } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: Date;
  icon: 'document' | 'image' | 'video' | 'audio' | 'folder';
}

const files: FileItem[] = [
  {
    id: '1',
    name: 'Impact Reports',
    type: 'folder',
    modified: new Date(Date.now() - 2 * 60 * 60000),
    icon: 'folder',
  },
  {
    id: '2',
    name: 'AI Model Configs',
    type: 'folder',
    modified: new Date(Date.now() - 5 * 60 * 60000),
    icon: 'folder',
  },
  {
    id: '3',
    name: 'Q4_Financial_Report.pdf',
    type: 'file',
    size: '2.4 MB',
    modified: new Date(Date.now() - 24 * 60 * 60000),
    icon: 'document',
  },
  {
    id: '4',
    name: 'Carbon_Offset_Analysis.xlsx',
    type: 'file',
    size: '1.8 MB',
    modified: new Date(Date.now() - 3 * 24 * 60 * 60000),
    icon: 'document',
  },
  {
    id: '5',
    name: 'Ecosystem_Visualization.png',
    type: 'file',
    size: '456 KB',
    modified: new Date(Date.now() - 5 * 24 * 60 * 60000),
    icon: 'image',
  },
  {
    id: '6',
    name: 'Tutorial_Video.mp4',
    type: 'file',
    size: '45.2 MB',
    modified: new Date(Date.now() - 7 * 24 * 60 * 60000),
    icon: 'video',
  },
  {
    id: '7',
    name: 'DAO_Proposal_Template.docx',
    type: 'file',
    size: '125 KB',
    modified: new Date(Date.now() - 10 * 24 * 60 * 60000),
    icon: 'document',
  },
  {
    id: '8',
    name: 'Blockchain_Data.json',
    type: 'file',
    size: '3.2 MB',
    modified: new Date(Date.now() - 12 * 24 * 60 * 60000),
    icon: 'document',
  },
];

export function FileManager() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const getFileIcon = (icon: string) => {
    switch (icon) {
      case 'folder':
        return <Folder className="w-8 h-8 sm:w-12 sm:h-12 text-amber-600" />;
      case 'document':
        return <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />;
      case 'image':
        return <Image className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600" />;
      case 'video':
        return <Video className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" />;
      case 'audio':
        return <Music className="w-8 h-8 sm:w-12 sm:h-12 text-pink-600" />;
      default:
        return <File className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
              <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
              File Manager
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage documents, media, and system files
            </p>
          </div>
          
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Files</p>
          <p className="text-xl sm:text-2xl">{files.filter(f => f.type === 'file').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Folders</p>
          <p className="text-xl sm:text-2xl">{files.filter(f => f.type === 'folder').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Storage Used</p>
          <p className="text-xl sm:text-2xl">53.2 MB</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Storage Limit</p>
          <p className="text-xl sm:text-2xl">10 GB</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  {getFileIcon(file.icon)}
                </div>
                <p className="text-sm mb-1 line-clamp-2 break-all">{file.name}</p>
                {file.size && (
                  <p className="text-xs text-gray-500 mb-1">{file.size}</p>
                )}
                <p className="text-xs text-gray-400">{formatDate(file.modified)}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-center gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Download className="w-3 h-3 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600">Size</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600">Modified</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.icon)}
                        <span className="text-sm">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{file.size || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatDate(file.modified)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="sm:hidden divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <div key={file.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  {getFileIcon(file.icon)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-1 truncate">{file.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {file.size && <span>{file.size}</span>}
                      <span>{formatDate(file.modified)}</span>
                    </div>
                  </div>
                  <button className="p-1">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full">
            <h3 className="text-lg sm:text-xl mb-4">Upload Files</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here</p>
              <p className="text-xs text-gray-500 mb-4">or</p>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">
                Browse Files
              </button>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
