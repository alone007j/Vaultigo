
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
    return <Folder className="h-8 w-8 text-cyan-400" />;
  }

  if (!item.mimeType) {
    return <File className="h-8 w-8 text-slate-400" />;
  }

  if (item.mimeType.startsWith('image/')) {
    return <Image className="h-8 w-8 text-green-400" />;
  }

  if (item.mimeType.startsWith('video/')) {
    return <Video className="h-8 w-8 text-red-400" />;
  }

  if (item.mimeType.startsWith('audio/')) {
    return <Music className="h-8 w-8 text-purple-400" />;
  }

  if (item.mimeType.includes('pdf') || item.mimeType.includes('document')) {
    return <FileText className="h-8 w-8 text-blue-400" />;
  }

  return <File className="h-8 w-8 text-slate-400" />;
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
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div 
          className="flex-1 cursor-pointer" 
          onClick={handleClick}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getFileIcon(item)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">
                {item.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {item.size && (
                  <span className="text-xs text-slate-400">
                    {formatFileSize(item.size)}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {formatDate(item.modifiedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:bg-slate-700/50 hover:text-white flex-shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-slate-800 border-slate-700 text-white z-50"
          >
            {item.type === 'file' && (
              <DropdownMenuItem 
                onClick={() => onPreview(item)}
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onShare(item)}
              className="text-white hover:bg-slate-700 focus:bg-slate-700"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            {item.type === 'file' && (
              <DropdownMenuItem 
                onClick={() => onDownload(item)}
                className="text-white hover:bg-slate-700 focus:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(item.id)}
              className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
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
