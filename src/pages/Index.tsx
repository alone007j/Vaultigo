import { useState, useMemo, useEffect } from 'react';
import { Menu, Search, Cloud, Upload, Bell, Settings, User, Plus, Shield, Zap, ArrowLeft, ChevronRight } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  const [showSidebar, setShowSidebar] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/auth');
    }
  };

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

  const handleBackNavigation = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <div className="text-xl font-bold mb-2">Vaultigo</div>
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-800 text-white">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{user.user_metadata?.full_name || user.email}</h3>
              <p className="text-sm text-gray-400">Premium Plan</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Storage Used</span>
              <span className="text-sm text-gray-300">{storageStats.used} GB / {storageStats.total} GB</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${storageStats.percentage}%` }}
              />
            </div>
          </div>

          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                setShowSidebar(false);
                setCurrentPath(['My Files']);
              }}
            >
              <Cloud className="h-5 w-5 mr-3" />
              My Files
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                setShowSidebar(false);
                setShowUserProfile(true);
              }}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                setShowSidebar(false);
                setShowSettings(true);
              }}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-400 hover:bg-red-900/20 transition-colors duration-200"
              onClick={handleSignOut}
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </nav>
        </div>
      </div>

      <div className="min-h-screen">
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentPath.length > 1 ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackNavigation}
                    className="text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(true)}
                    className="text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Cloud className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-white">Vaultigo</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUserProfile(true)}
                  className="text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-4 bg-gray-900">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="px-4 py-2 bg-gray-800">
          <div className="flex items-center space-x-2">
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-500 mx-1" />}
                <Button
                  variant="ghost"
                  className="text-sm text-gray-300 hover:text-white p-1 h-auto transition-colors duration-200"
                  onClick={() => setCurrentPath(prev => prev.slice(0, index + 1))}
                >
                  {path}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Files</span>
            </Button>
            
            <Button 
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 h-12 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>New Folder</span>
            </Button>
          </div>
        </div>

        <div className="px-4 pb-24">
          <div className="grid grid-cols-1 gap-3">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-all duration-200 hover:scale-105"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload your first file
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3">
          <div className="flex items-center justify-around">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center space-y-1 text-blue-400 hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setCurrentPath(['My Files'])}
            >
              <Cloud className="h-5 w-5" />
              <span className="text-xs">Files</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
              <span className="text-xs">Search</span>
            </Button>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowUserProfile(true)}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowSettings(true)}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Files</DialogTitle>
          </DialogHeader>
          <UploadArea 
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-4">
          <UserProfile onClose={() => setShowUserProfile(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-4">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>

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
