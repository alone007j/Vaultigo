
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, List, Filter } from 'lucide-react';
import { FileItemComponent } from '@/components/FileItem';
import { useFileManagement } from '@/hooks/useFileManagement';
import { useAuth } from '@/hooks/useAuth';

export const FilesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  const { files, loading, deleteFile, downloadFile, previewFile } = useFileManagement(user?.id || null);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = (item: any) => {
    if (item.type === 'file') {
      previewFile(item);
    }
  };

  const handleDelete = (id: string) => {
    deleteFile(id);
  };

  const handleDownload = (item: any) => {
    downloadFile(item);
  };

  const handleShare = (item: any) => {
    // Share functionality would be implemented here
    console.log('Share file:', item);
  };

  const handlePreview = (item: any) => {
    previewFile(item);
  };

  // Convert file format to match FileItem interface
  const convertToFileItem = (file: any) => ({
    id: file.id,
    name: file.name,
    type: 'file' as const,
    size: file.size,
    mimeType: file.mime_type,
    modifiedAt: new Date(file.updated_at),
    url: file.url
  });

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-8 text-center">
          <div className="text-white">Loading files...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>My Files</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-white hover:bg-white/20"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>

        {/* Files Grid/List */}
        {filteredFiles.length > 0 ? (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredFiles.map((file) => (
              <FileItemComponent
                key={file.id}
                item={convertToFileItem(file)}
                onOpen={handleOpen}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onShare={handleShare}
                onPreview={handlePreview}
                view={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No files found</div>
            <div className="text-gray-500 text-sm">
              {searchQuery ? 'Try adjusting your search' : 'Upload some files to get started'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
