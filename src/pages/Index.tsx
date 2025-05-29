import { useState, useMemo } from 'react';
import { Grid, List, Plus, FolderPlus, Search, Cloud, HardDrive, Users, User, Settings, Bell, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileItemComponent, FileItem } from '@/components/FileItem';
import { UploadArea } from '@/components/UploadArea';
import { UserProfile } from '@/components/UserProfile';
import { SettingsPanel } from '@/components/SettingsPanel';
import { FilePreviewModal } from '@/components/FilePreviewModal';
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
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      id: '4',
      name: 'vacation-photo.jpg',
      type: 'file',
      size: 4567890,
      mimeType: 'image/jpeg',
      modifiedAt: new Date(2024, 4, 22),
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    },
    {
      id: '5',
      name: 'presentation.pptx',
      type: 'file',
      size: 8901234,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      modifiedAt: new Date(2024, 4, 18),
      url: 'https://file-examples.com/storage/fe68c8a7c95bb87ac4b93f7/2017/10/file_example_PPT_250kB.ppt',
    },
  ]);
  
  const [currentPath, setCurrentPath] = useState(['My Drive']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
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
    
    setTimeout(() => {
      const newFiles: FileItem[] = uploadedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'file' as const,
        size: file.size,
        mimeType: file.type,
        modifiedAt: new Date(),
        url: URL.createObjectURL(file),
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      setShowUploadModal(false);
      toast({
        title: "Upload successful",
        description: `${uploadedFiles.length} file(s) uploaded successfully`,
      });
    }, 2000);
  };

  const handleFileOpen = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(prev => [...prev, item.name]);
    } else {
      handleFilePreview(item);
    }
  };

  const handleFilePreview = (item: FileItem) => {
    setSelectedFile(item);
    setShowPreviewModal(true);
  };

  const handleFileDelete = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File deleted",
      description: "File has been moved to trash",
    });
  };

  const handleFileDownload = (item: FileItem) => {
    if (item.url) {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${item.name}`,
      });
    } else {
      toast({
        title: "Download failed",
        description: "File URL not available",
        variant: "destructive",
      });
    }
  };

  const handleFileShare = (item: FileItem) => {
    const shareUrl = `${window.location.origin}/shared/${item.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share link copied",
      description: `Share link for ${item.name} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Enhanced Header */}
      <header className="border-b border-white/20 bg-white/10 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CloudStore
                </h1>
                <p className="text-sm text-blue-200">Your secure cloud storage</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and folders..."
                  className="pl-10 bg-white/10 border-white/30 focus:border-blue-400 focus:bg-white/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadModal(true)}
                className="border-white/30 hover:bg-white/20 text-white hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button 
                variant="outline" 
                className="border-white/30 hover:bg-white/20 text-white hover:text-white"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              
              <Separator orientation="vertical" className="h-6 bg-white/30" />
              
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-white/20 text-white"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(true)}
                className="hover:bg-white/20 text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              {/* Enhanced Profile Button */}
              <Button 
                variant="ghost"
                onClick={() => setShowUserProfile(true)}
                className="flex items-center space-x-2 hover:bg-white/20 text-white p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-blue-200">Premium</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Enhanced Sidebar */}
          <div className="col-span-3">
            <div className="space-y-4">
              {/* Quick Stats */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">Total Files</span>
                    <span className="text-sm font-medium text-white">{files.filter(f => f.type === 'file').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">Folders</span>
                    <span className="text-sm font-medium text-white">{files.filter(f => f.type === 'folder').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">Storage Used</span>
                    <span className="text-sm font-medium text-white">{storageStats.used}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <HardDrive className="h-4 w-4 mr-2" />
                    My Drive
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <Users className="h-4 w-4 mr-2" />
                    Shared with me
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recent
                  </Button>
                </div>
              </div>
              
              {/* Storage */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <h3 className="font-medium mb-3 text-white">Storage</h3>
                <div className="space-y-3">
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${storageStats.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-blue-200">
                    {storageStats.used} GB of {storageStats.total} GB used
                  </p>
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Upgrade Storage
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 min-h-[600px] shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center space-x-2">
                  {currentPath.map((path, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                      <span className="text-sm font-medium text-white">{path}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-blue-600' : 'text-white hover:bg-white/20'}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-blue-600' : 'text-white hover:bg-white/20'}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

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
                        onPreview={handleFilePreview}
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
                        onPreview={handleFilePreview}
                        view="list"
                      />
                    ))}
                  </div>
                )}
                
                {filteredFiles.length === 0 && (
                  <div className="text-center py-12">
                    <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2 text-white">No files found</h3>
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
        <DialogContent className="bg-slate-900/95 border-white/20 max-w-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Files</DialogTitle>
          </DialogHeader>
          <UploadArea 
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </DialogContent>
      </Dialog>

      {/* User Profile Modal */}
      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="bg-slate-900/95 border-white/20 max-w-md backdrop-blur-xl">
          <UserProfile onClose={() => setShowUserProfile(false)} />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-slate-900/95 border-white/20 max-w-lg backdrop-blur-xl">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        file={selectedFile}
        onDownload={handleFileDownload}
        onShare={handleFileShare}
        onDelete={handleFileDelete}
      />
    </div>
  );
};

export default Index;
