
import { useState } from 'react';
import { File, Folder, Download, Trash2, Share, MoreVertical, Image, FileText, Music, Video, Eye } from 'lucide-react';
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
  onPreview?: (item: FileItem) => void;
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
  onPreview,
  view 
}: FileItemProps) => {
  const [isSelected, setIsSelected] = useState(false);
  
  const IconComponent = item.type === 'folder' ? Folder : getFileIcon(item.mimeType);
  
  if (view === 'list') {
    return (
      <div 
        className={`flex items-center justify-between p-3 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected ? 'bg-blue-500/20 border border-blue-500/50' : ''
        }`}
        onClick={() => onOpen(item)}
        onDoubleClick={() => setIsSelected(!isSelected)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <IconComponent className={`h-5 w-5 ${item.type === 'folder' ? 'text-blue-400' : 'text-gray-300'}`} />
          <span className="font-medium truncate text-white">{item.name}</span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-300">
          <span className="w-20">{item.size ? formatFileSize(item.size) : '-'}</span>
          <span className="w-32">{formatDate(item.modifiedAt)}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="hover:bg-white/20 text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
              {item.type === 'file' && onPreview && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              {item.type === 'file' && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(item);
                }}
                className="text-white hover:bg-white/20"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
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
    <Card className={`p-4 hover:bg-white/10 cursor-pointer transition-all duration-300 border-white/20 hover:border-white/40 group backdrop-blur-sm ${
      isSelected ? 'ring-2 ring-blue-500 border-blue-500/50' : ''
    }`}>
      <div 
        className="space-y-3"
        onClick={() => onOpen(item)}
        onDoubleClick={() => setIsSelected(!isSelected)}
      >
        <div className="flex items-center justify-between">
          <IconComponent className={`h-8 w-8 ${item.type === 'folder' ? 'text-blue-400' : 'text-gray-300'}`} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
              {item.type === 'file' && onPreview && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              {item.type === 'file' && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(item);
                }}
                className="text-white hover:bg-white/20"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <h3 className="font-medium truncate text-white">{item.name}</h3>
          <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
            <span>{item.size ? formatFileSize(item.size) : ''}</span>
            <span>{formatDate(item.modifiedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
