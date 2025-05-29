
import { X, Download, Share, Trash2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileItem } from './FileItem';
import { formatFileSize, formatDate } from '@/lib/utils';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
  onDownload: (item: FileItem) => void;
  onShare: (item: FileItem) => void;
  onDelete: (id: string) => void;
}

export const FilePreviewModal = ({ 
  isOpen, 
  onClose, 
  file, 
  onDownload, 
  onShare, 
  onDelete 
}: FilePreviewModalProps) => {
  if (!file) return null;

  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const isAudio = file.mimeType?.startsWith('audio/');
  const isPDF = file.mimeType === 'application/pdf';
  const isText = file.mimeType?.startsWith('text/') || file.mimeType?.includes('document');

  // Create a sample image URL for demo files that don't have real URLs
  const getPreviewUrl = (file: FileItem) => {
    if (file.url && file.url !== 'https://example.com/vacation-photo.jpg') {
      return file.url;
    }
    
    // For demo purposes, use placeholder images
    if (file.name === 'vacation-photo.jpg' || isImage) {
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
    }
    
    return file.url;
  };

  const renderPreview = () => {
    const previewUrl = getPreviewUrl(file);
    
    if (isImage) {
      return (
        <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt={file.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onError={(e) => {
              console.log('Image failed to load:', previewUrl);
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>
      );
    }

    if (isVideo && previewUrl) {
      return (
        <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
          <video 
            src={previewUrl} 
            controls 
            className="w-full h-full object-contain rounded-lg"
            onError={() => console.log('Video failed to load:', previewUrl)}
          />
        </div>
      );
    }

    if (isAudio && previewUrl) {
      return (
        <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-lg">
          <audio 
            src={previewUrl} 
            controls 
            className="w-full max-w-md"
            onError={() => console.log('Audio failed to load:', previewUrl)}
          />
        </div>
      );
    }

    if (isPDF && previewUrl) {
      return (
        <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
          <iframe 
            src={previewUrl} 
            className="w-full h-full rounded-lg"
            title={file.name}
            onError={() => console.log('PDF failed to load:', previewUrl)}
          />
        </div>
      );
    }

    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Preview not available</h3>
          <p className="text-sm text-gray-500">This file type cannot be previewed</p>
          {previewUrl && (
            <Button 
              variant="outline" 
              className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => window.open(previewUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-4xl">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{file.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {file.mimeType || 'Unknown'}
                  </Badge>
                  <span className="text-sm text-gray-500">{formatFileSize(file.size || 0)}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{formatDate(file.modifiedAt)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="bg-gray-200" />

          {/* Preview */}
          {renderPreview()}

          <Separator className="bg-gray-200" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last modified: {file.modifiedAt.toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onShare(file)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => onDownload(file)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onDelete(file.id);
                  onClose();
                }}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
