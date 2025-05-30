
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

  const getPreviewUrl = (file: FileItem) => {
    if (file.url && file.url !== 'https://example.com/vacation-photo.jpg') {
      return file.url;
    }
    
    if (file.name === 'vacation-photo.jpg' || isImage) {
      return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
    }
    
    return file.url;
  };

  const renderPreview = () => {
    const previewUrl = getPreviewUrl(file);
    
    if (isImage) {
      return (
        <div className="w-full h-80 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-700/50">
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
        <div className="w-full h-80 bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-700/50">
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
        <div className="w-full h-32 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50">
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
        <div className="w-full h-80 bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-700/50">
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
      <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-slate-600">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-white mb-2">Preview not available</h3>
          <p className="text-sm text-slate-400">This file type cannot be previewed</p>
          {previewUrl && (
            <Button 
              variant="outline" 
              className="mt-4 border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50"
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
      <DialogContent className="bg-slate-900/95 backdrop-blur-lg border-slate-700 text-white max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{file.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-500/30">
                    {file.mimeType || 'Unknown'}
                  </Badge>
                  <span className="text-sm text-slate-400">{formatFileSize(file.size || 0)}</span>
                  <span className="text-sm text-slate-500">•</span>
                  <span className="text-sm text-slate-400">{formatDate(file.modifiedAt)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:bg-slate-800/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="bg-slate-700/50" />

          {/* Preview */}
          {renderPreview()}

          <Separator className="bg-slate-700/50" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Last modified: {file.modifiedAt.toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onShare(file)}
                className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600/50"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={() => onDownload(file)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
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
                className="border-red-600/50 bg-red-900/20 text-red-400 hover:bg-red-900/40"
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
