
import { useState } from 'react';
import { Download, Trash2, Eye, Upload, FileText, Image, Video, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilePreviewModal } from '@/components/FilePreviewModal';
import { UploadArea } from '@/components/UploadArea';
import { useFileManagement, FileItem } from '@/hooks/useFileManagement';
import { formatFileSize, formatDate } from '@/lib/utils';

export const FilesSection = () => {
  const { files, loading, uploadFile, downloadFile, deleteFile } = useFileManagement();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    return FileText;
  };

  const handleFileUpload = async (uploadedFiles: File[]) => {
    for (const file of uploadedFiles) {
      await uploadFile(file);
    }
  };

  const handlePreview = (file: FileItem) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const handleShare = (file: FileItem) => {
    navigator.clipboard.writeText(file.url);
  };

  const handleDownload = async (file: FileItem) => {
    await downloadFile(file);
  };

  const handleDelete = async (fileId: string) => {
    await deleteFile(fileId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UploadArea onFileUpload={handleFileUpload} isUploading={false} />
        </CardContent>
      </Card>

      {/* Files Grid */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Your Files ({files.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No files uploaded yet</h3>
              <p>Upload your first file to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => {
                const Icon = getFileIcon(file.mimeType);
                return (
                  <div
                    key={file.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{file.name}</h3>
                        <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                        <p className="text-gray-500 text-xs">{formatDate(file.uploadedAt)}</p>
                        
                        {file.isUploading && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Uploading...</span>
                              <span>{Math.round(file.uploadProgress || 0)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${file.uploadProgress || 0}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {!file.isUploading && (
                          <div className="flex space-x-1 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(file)}
                              className="border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(file.id)}
                              className="border-red-600 bg-red-900/20 text-red-400 hover:bg-red-900/40"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        file={selectedFile}
        onDownload={handleDownload}
        onShare={handleShare}
        onDelete={(file) => handleDelete(file.id)}
      />
    </div>
  );
};
