
import { useState } from 'react';
import { File, Folder, Download, Trash2, Share, MoreVertical, Image, FileText, Music, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  view: 'grid' | 'list';
}

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return File;
  
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('text') || mimeType.includes('document')) return FileText;
  
  return File;
};

export const FileItemComponent = ({ 
  item, 
  onOpen, 
  onDelete, 
  onDownload, 
  onShare, 
  view 
}: FileItemProps) => {
  const [isSelected, setIsSelected] = useState(false);
  
  const IconComponent = item.type === 'folder' ? Folder : getFileIcon(item.mimeType);
  
  if (view === 'list') {
    return (
      <div 
        className={`flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-500/20' : ''
        }`}
        onClick={() => onOpen(item)}
        onDoubleClick={() => setIsSelected(!isSelected)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <IconComponent className={`h-5 w-5 ${item.type === 'folder' ? 'text-blue-400' : 'text-gray-400'}`} />
          <span className="font-medium truncate">{item.name}</span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <span className="w-20">{item.size ? formatFileSize(item.size) : '-'}</span>
          <span className="w-32">{formatDate(item.modifiedAt)}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-white/20">
              {item.type === 'file' && (
                <DropdownMenuItem onClick={() => onDownload(item)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onShare(item)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(item.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  
  return (
    <Card className={`p-4 hover:bg-white/5 cursor-pointer transition-all duration-200 border-white/10 ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div 
        className="space-y-3"
        onClick={() => onOpen(item)}
        onDoubleClick={() => setIsSelected(!isSelected)}
      >
        <div className="flex items-center justify-between">
          <IconComponent className={`h-8 w-8 ${item.type === 'folder' ? 'text-blue-400' : 'text-gray-400'}`} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-white/20">
              {item.type === 'file' && (
                <DropdownMenuItem onClick={() => onDownload(item)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onShare(item)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(item.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <h3 className="font-medium truncate">{item.name}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>{item.size ? formatFileSize(item.size) : ''}</span>
            <span>{formatDate(item.modifiedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
