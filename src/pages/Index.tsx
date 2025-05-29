
import { useState, useMemo } from 'react';
import { Grid, List, Plus, FolderPlus, Search, Cloud, HardDrive, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FileItemComponent, FileItem } from '@/components/FileItem';
import { UploadArea } from '@/components/UploadArea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      modifiedAt: new Date(2024, 4, 15),
    },
    {
      id: '2',
      name: 'Photos',
      type: 'folder',
      modifiedAt: new Date(2024, 4, 20),
    },
    {
      id: '3',
      name: 'project-report.pdf',
      type: 'file',
      size: 2456789,
      mimeType: 'application/pdf',
      modifiedAt: new Date(2024, 4, 25),
    },
    {
      id: '4',
      name: 'vacation-photo.jpg',
      type: 'file',
      size: 4567890,
      mimeType: 'image/jpeg',
      modifiedAt: new Date(2024, 4, 22),
    },
    {
      id: '5',
      name: 'presentation.pptx',
      type: 'file',
      size: 8901234,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      modifiedAt: new Date(2024, 4, 18),
    },
  ]);
  
  const [currentPath, setCurrentPath] = useState(['My Drive']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const filteredFiles = useMemo(() => {
    return files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const storageStats = {
    used: 15.6,
    total: 100,
    percentage: 15.6,
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newFiles: FileItem[] = uploadedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'file' as const,
        size: file.size,
        mimeType: file.type,
        modifiedAt: new Date(),
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      setShowUploadModal(false);
    }, 2000);
  };

  const handleFileOpen = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(prev => [...prev, item.name]);
    } else {
      toast({
        title: "Opening file",
        description: `Opening ${item.name}`,
      });
    }
  };

  const handleFileDelete = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File deleted",
      description: "File has been moved to trash",
    });
  };

  const handleFileDownload = (item: FileItem) => {
    toast({
      title: "Downloading",
      description: `Downloading ${item.name}`,
    });
  };

  const handleFileShare = (item: FileItem) => {
    toast({
      title: "Share link copied",
      description: `Share link for ${item.name} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cloud className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">CloudStore</h1>
            </div>
            
            <div className="flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and folders..."
                  className="pl-10 bg-white/10 border-white/20 focus:border-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadModal(true)}
                className="border-white/20 hover:bg-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/10">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="space-y-4">
              {/* Navigation */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <HardDrive className="h-4 w-4 mr-2" />
                    My Drive
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Shared with me
                  </Button>
                </div>
              </div>
              
              {/* Storage */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-medium mb-3">Storage</h3>
                <div className="space-y-2">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${storageStats.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {storageStats.used} GB of {storageStats.total} GB used
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white/5 rounded-lg border border-white/10 min-h-[600px]">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  {currentPath.map((path, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                      <span className="text-sm font-medium">{path}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* File List */}
              <div className="p-4">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFiles.map((file) => (
                      <FileItemComponent
                        key={file.id}
                        item={file}
                        onOpen={handleFileOpen}
                        onDelete={handleFileDelete}
                        onDownload={handleFileDownload}
                        onShare={handleFileShare}
                        view="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-3 text-sm font-medium text-muted-foreground border-b border-white/10">
                      <span>Name</span>
                      <div className="flex space-x-6">
                        <span className="w-20">Size</span>
                        <span className="w-32">Modified</span>
                        <span className="w-8"></span>
                      </div>
                    </div>
                    {filteredFiles.map((file) => (
                      <FileItemComponent
                        key={file.id}
                        item={file}
                        onOpen={handleFileOpen}
                        onDelete={handleFileDelete}
                        onDownload={handleFileDownload}
                        onShare={handleFileShare}
                        view="list"
                      />
                    ))}
                  </div>
                )}
                
                {filteredFiles.length === 0 && (
                  <div className="text-center py-12">
                    <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No files found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search.' : 'Upload files to get started.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-card border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <UploadArea 
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
