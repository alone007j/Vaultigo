
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

  const renderPreview = () => {
    if (isImage && file.url) {
      return (
        <div className="w-full h-96 flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
          <img 
            src={file.url} 
            alt={file.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (isVideo && file.url) {
      return (
        <div className="w-full h-96 bg-black/20 rounded-lg overflow-hidden">
          <video 
            src={file.url} 
            controls 
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    if (isAudio && file.url) {
      return (
        <div className="w-full h-32 flex items-center justify-center bg-black/20 rounded-lg">
          <audio src={file.url} controls className="w-full max-w-md" />
        </div>
      );
    }

    if (isPDF && file.url) {
      return (
        <div className="w-full h-96 bg-black/20 rounded-lg overflow-hidden">
          <iframe 
            src={file.url} 
            className="w-full h-full"
            title={file.name}
          />
        </div>
      );
    }

    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white/5 rounded-lg border-2 border-dashed border-white/20">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-white mb-2">Preview not available</h3>
          <p className="text-sm text-gray-400">This file type cannot be previewed</p>
          {file.url && (
            <Button 
              variant="outline" 
              className="mt-4 border-white/30 text-white hover:bg-white/20"
              onClick={() => window.open(file.url, '_blank')}
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
      <DialogContent className="bg-slate-900/95 border-white/20 max-w-4xl backdrop-blur-xl">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{file.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                    {file.mimeType || 'Unknown'}
                  </Badge>
                  <span className="text-sm text-gray-400">{formatFileSize(file.size || 0)}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">{formatDate(file.modifiedAt)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="bg-white/20" />

          {/* Preview */}
          {renderPreview()}

          <Separator className="bg-white/20" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Last modified: {file.modifiedAt.toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onShare(file)}
                className="border-white/30 text-white hover:bg-white/20"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => onDownload(file)}
                className="border-white/30 text-white hover:bg-white/20"
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
                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
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
