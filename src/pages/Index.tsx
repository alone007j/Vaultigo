
import { useState, useMemo } from 'react';
import { Menu, Search, Cloud, Upload, Bell, Settings, User, Plus, Shield, Zap } from 'lucide-react';
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
  ]);
  
  const [currentPath, setCurrentPath] = useState(['My Files']);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Cloud className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center">
                    <Zap className="h-2 w-2 text-slate-900" />
                  </div>
                </div>
                <h1 className="text-xl font-bold text-white">Vaultigo</h1>
              </div>
            </div>
            
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-300 hover:bg-slate-800/50 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-4 py-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">Next-Generation Cloud Storage</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-4 leading-tight">
          Secure, Smart,<br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Lightning Fast
          </span> Cloud<br />
          Storage
        </h2>
        
        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
          Experience the future of cloud storage with AI-powered organization, military-grade security, and seamless integration across all your devices.
        </p>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-8">
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 rounded-xl text-base"
          >
            Get Started Free →
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-slate-600 bg-slate-800/30 text-slate-200 hover:bg-slate-700/50 py-3 rounded-xl text-base"
          >
            Watch Demo
          </Button>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">Secure</h3>
            <p className="text-xs text-slate-400">Military-grade encryption</p>
          </div>
          
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-white mb-1">Fast</h3>
            <p className="text-xs text-slate-400">Lightning-fast sync</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search files..."
            className="pl-10 bg-slate-800/50 backdrop-blur-sm border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Storage Stats */}
      <div className="px-4 mb-6">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Storage Used</span>
            <span className="text-sm text-slate-300">{storageStats.used} GB / {storageStats.total} GB</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${storageStats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-12 rounded-xl flex items-center justify-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Files</span>
          </Button>
          
          <Button 
            variant="outline"
            className="border-slate-600 bg-slate-800/30 text-slate-200 hover:bg-slate-700/50 h-12 rounded-xl flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Folder</span>
          </Button>
        </div>
      </div>

      {/* Files Content */}
      <div className="px-4 pb-24">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-slate-600">/</span>}
                <span className="text-sm font-medium text-slate-300">{path}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Files Grid */}
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
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-16">
            <Cloud className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-medium mb-2 text-slate-300">No files found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Try adjusting your search.' : 'Upload files to get started.'}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setShowUploadModal(true)} 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl px-6 py-3"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload your first file
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-around">
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-cyan-400">
            <Cloud className="h-5 w-5" />
            <span className="text-xs">Files</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-slate-400">
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full p-3"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowUserProfile(true)}
            className="flex flex-col items-center space-y-1 text-slate-400"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowSettings(true)}
            className="flex flex-col items-center space-y-1 text-slate-400"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm mx-4">
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
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm mx-4">
          <UserProfile onClose={() => setShowUserProfile(false)} />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm mx-4">
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
