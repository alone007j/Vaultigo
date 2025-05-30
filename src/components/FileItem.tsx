
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
        className={`flex items-center justify-between p-4 hover:bg-gray-800 rounded-xl cursor-pointer transition-all duration-200 border ${
          isSelected ? 'bg-gray-800 border-blue-600' : 'border-gray-800 bg-gray-900'
        }`}
        onClick={() => onOpen(item)}
        onDoubleClick={() => setIsSelected(!isSelected)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <IconComponent className={`h-6 w-6 ${item.type === 'folder' ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-white truncate block">{item.name}</span>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
              <span>{item.size ? formatFileSize(item.size) : ''}</span>
              {item.size && <span>•</span>}
              <span>{formatDate(item.modifiedAt)}</span>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-700 hover:text-white">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
            {item.type === 'file' && onPreview && (
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(item);
                }}
                className="hover:bg-gray-700 text-white"
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
                className="hover:bg-gray-700 text-white"
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
              className="hover:bg-gray-700 text-white"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  
  return (
    <Card className={`p-4 hover:bg-gray-800 cursor-pointer transition-all duration-300 border group ${
      isSelected ? 'ring-2 ring-blue-500 border-blue-600 bg-gray-800' : 'border-gray-800 bg-gray-900 hover:border-gray-700'
    }`}>
      <div 
        className="space-y-3"
        onClick={() => onOpen(item)}
        onDoubleClick={() => setIsSelected(!isSelected)}
      >
        <div className="flex items-center justify-between">
          <IconComponent className={`h-8 w-8 ${item.type === 'folder' ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:bg-gray-700 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
              {item.type === 'file' && onPreview && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="hover:bg-gray-700 text-white"
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
                  className="hover:bg-gray-700 text-white"
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
                className="hover:bg-gray-700 text-white"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <h3 className="font-medium text-white truncate">{item.name}</h3>
          <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
            <span>{item.size ? formatFileSize(item.size) : ''}</span>
            <span>{formatDate(item.modifiedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
