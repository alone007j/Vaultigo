
import { MoreVertical, File, Folder, Image, FileText, Video, Music, Download, Share, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatFileSize, formatDate } from '@/lib/utils';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  modifiedAt: Date;
  url?: string;
}

interface FileItemProps {
  item: FileItem;
  onOpen: (item: FileItem) => void;
  onDelete: (id: string) => void;
  onDownload: (item: FileItem) => void;
  onShare: (item: FileItem) => void;
  onPreview: (item: FileItem) => void;
  view: 'grid' | 'list';
}

const getFileIcon = (item: FileItem) => {
  if (item.type === 'folder') {
    return <Folder className="h-6 w-6 text-blue-400" />;
  }

  if (!item.mimeType) {
    return <File className="h-6 w-6 text-gray-400" />;
  }

  if (item.mimeType.startsWith('image/')) {
    return <Image className="h-6 w-6 text-green-400" />;
  }

  if (item.mimeType.startsWith('video/')) {
    return <Video className="h-6 w-6 text-red-400" />;
  }

  if (item.mimeType.startsWith('audio/')) {
    return <Music className="h-6 w-6 text-purple-400" />;
  }

  if (item.mimeType.includes('pdf') || item.mimeType.includes('document')) {
    return <FileText className="h-6 w-6 text-blue-400" />;
  }

  return <File className="h-6 w-6 text-gray-400" />;
};

export const FileItemComponent = ({ 
  item, 
  onOpen, 
  onDelete, 
  onDownload, 
  onShare, 
  onPreview, 
  view 
}: FileItemProps) => {
  const handleClick = () => {
    onOpen(item);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 flex-1 cursor-pointer" 
          onClick={handleClick}
        >
          <div className="flex-shrink-0 p-2 bg-gray-700 rounded-lg">
            {getFileIcon(item)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {item.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              {item.size && (
                <span className="text-xs text-gray-400">
                  {formatFileSize(item.size)}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatDate(item.modifiedAt)}
              </span>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:bg-gray-700 hover:text-white flex-shrink-0 transition-colors duration-200"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-gray-800 border-gray-700 text-white z-50"
          >
            {item.type === 'file' && (
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(item);
                }}
                className="text-white hover:bg-gray-700 focus:bg-gray-700 transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onShare(item);
              }}
              className="text-white hover:bg-gray-700 focus:bg-gray-700 transition-colors duration-200"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            {item.type === 'file' && (
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(item);
                }}
                className="text-white hover:bg-gray-700 focus:bg-gray-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
