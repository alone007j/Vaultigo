
import { useState, useMemo } from 'react';
import { Grid, List, Plus, Search, Cloud, Upload, Bell, Settings, User, Menu, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
      name: 'Work Documents',
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
  
  const [currentPath, setCurrentPath] = useState(['My Files']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Menu */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMenu(!showMenu)}
                className="text-white hover:bg-gray-800"
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                  <Cloud className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">CloudVault</h1>
                </div>
              </div>
            </div>
            
            {/* Profile and Actions */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-gray-800"
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => setShowUserProfile(true)}
                className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded-lg"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">JD</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-4 py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-300">Quick Actions</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Files
          </Button>
          
          <Button 
            variant="outline"
            className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 h-12 rounded-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Storage Info */}
      <div className="px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Storage Used</span>
          <span className="text-sm text-gray-300">{storageStats.used} GB / {storageStats.total} GB</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${storageStats.percentage}%` }}
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          {currentPath.map((path, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-600">/</span>}
              <span className="text-sm font-medium text-gray-300">{path}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Files Content */}
      <div className="p-4 min-h-[400px]">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-2">
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
            <Cloud className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-medium mb-2 text-gray-300">No files found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try adjusting your search.' : 'Upload files to get started.'}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setShowUploadModal(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload your first file
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2">
        <div className="flex items-center justify-around">
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-blue-500">
            <Cloud className="h-5 w-5" />
            <span className="text-xs">Files</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowSettings(true)}
            className="flex flex-col items-center space-y-1 text-gray-400"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-sm mx-4">
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
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-sm mx-4">
          <UserProfile onClose={() => setShowUserProfile(false)} />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-sm mx-4">
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
