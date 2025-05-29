
import { useState, useMemo } from 'react';
import { Grid, List, Plus, Search, Cloud, HardDrive, Users, TrendingUp, Upload, FolderPlus, Bell, Settings, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CloudStore</h1>
                  <p className="text-xs text-gray-500">Secure cloud storage</p>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files and folders..."
                  className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-400 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              
              <Button 
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              
              <div className="w-px h-6 bg-gray-200 mx-2" />
              
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-gray-100"
              >
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(true)}
                className="hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => setShowUserProfile(true)}
                className="flex items-center space-x-2 hover:bg-gray-100 p-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Premium</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Modern Sidebar */}
          {sidebarOpen && (
            <div className="w-64 space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-blue-50 hover:text-blue-700"
                  >
                    <HardDrive className="h-4 w-4 mr-3" />
                    My Drive
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Shared
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-blue-50 hover:text-blue-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-3" />
                    Recent
                  </Button>
                </CardContent>
              </Card>

              {/* Storage Stats */}
              <Card className="bg-white shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700">Storage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Used</span>
                      <span className="font-medium">{storageStats.used} GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${storageStats.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {storageStats.used} GB of {storageStats.total} GB used
                    </p>
                  </div>
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Upgrade Storage
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Overview */}
              <Card className="bg-white shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700">Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Files</span>
                    <span className="text-sm font-medium">{files.filter(f => f.type === 'file').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Folders</span>
                    <span className="text-sm font-medium">{files.filter(f => f.type === 'folder').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Shared</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <Card className="bg-white shadow-sm border-gray-200 min-h-[600px]">
              {/* Content Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  {currentPath.map((path, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                      <span className="text-sm font-medium text-gray-700">{path}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-100'}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-100'}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Files Content */}
              <div className="p-6">
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
                    <div className="flex items-center justify-between p-3 text-sm font-medium text-gray-500 border-b border-gray-100">
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
                  <div className="text-center py-16">
                    <Cloud className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2 text-gray-900">No files found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchQuery ? 'Try adjusting your search.' : 'Upload files to get started.'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowUploadModal(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload your first file
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-white border-gray-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Upload Files</DialogTitle>
          </DialogHeader>
          <UploadArea 
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </DialogContent>
      </Dialog>

      {/* User Profile Modal */}
      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="bg-white border-gray-200 max-w-md">
          <UserProfile onClose={() => setShowUserProfile(false)} />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-white border-gray-200 max-w-lg">
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
