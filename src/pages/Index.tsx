import { useState, useMemo, useEffect } from 'react';
import { Menu, Search, Cloud, Upload, Bell, Settings, User, Plus, ArrowLeft, ChevronRight, FolderPlus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileItemComponent, FileItem } from '@/components/FileItem';
import { UploadArea } from '@/components/UploadArea';
import { UserProfile } from '@/components/UserProfile';
import { SettingsPanel } from '@/components/SettingsPanel';
import { FilePreviewModal } from '@/components/FilePreviewModal';
import { WelcomeModal } from '@/components/WelcomeModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Logo } from '@/components/Logo';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, subscription, storageUsage, loading: profileLoading } = useUserProfile(user?.id || null);
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

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showPricingSection, setShowPricingSection] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Show welcome modal for new users
  useEffect(() => {
    if (user && !hasShownWelcome && !profileLoading) {
      const hasSeenWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true);
        setHasShownWelcome(true);
        localStorage.setItem(`welcome_shown_${user.id}`, 'true');
      }
    }
  }, [user, hasShownWelcome, profileLoading]);

  // Redirect to auth if not authenticated
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const filteredFiles = useMemo(() => {
    return files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const storageStats = {
    used: storageUsage ? (storageUsage.used_bytes / (1024 * 1024 * 1024)).toFixed(1) : '0.0',
    total: storageUsage ? (storageUsage.total_bytes / (1024 * 1024 * 1024)).toFixed(0) : '10',
    percentage: storageUsage ? (storageUsage.used_bytes / storageUsage.total_bytes) * 100 : 0,
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

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: folderName,
        type: 'folder',
        modifiedAt: new Date(),
      };
      setFiles(prev => [...prev, newFolder]);
      toast({
        title: "Folder created",
        description: `Folder "${folderName}" created successfully`,
      });
    }
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "Search Results",
        description: `Searching for "${searchQuery}"...`,
      });
      console.log('Searching for:', searchQuery);
    } else {
      toast({
        title: "Search",
        description: "Please enter a search term",
      });
    }
  };

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
    console.log('Notifications clicked');
  };

  const pricingPlans = [
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$9.99',
      period: '/month',
      color: 'from-blue-600 to-cyan-500',
      popular: true,
      features: ['1 TB Storage', 'Advanced AI', 'Priority Support'],
    },
    {
      id: 'elite',
      name: 'Elite Plan',
      price: '$19.99',
      period: '/month',
      color: 'from-purple-600 to-pink-500',
      features: ['5 TB Storage', 'Full AI Assistant', 'VIP Support'],
    },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-4" />
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Mobile-optimized overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Mobile-optimized sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-blue-800 text-white text-sm">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm truncate">{profile?.full_name || user?.email}</h3>
              <p className="text-xs text-gray-400">{subscription?.subscription_tier || 'Free'} Plan</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Storage Used</span>
              <span className="text-xs text-gray-300">{storageStats.used} GB / {storageStats.total} GB</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(storageStats.percentage, 100)}%` }}
              />
            </div>
          </div>

          <nav className="space-y-1">
            {/* Navigation buttons with mobile-friendly sizing */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200 h-12"
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
              className="w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200 h-12"
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
              className="w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200 h-12"
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
              className="w-full justify-start text-white hover:bg-gray-800 transition-colors duration-200 h-12"
              onClick={() => {
                setShowSidebar(false);
                setShowPricingSection(true);
              }}
            >
              <DollarSign className="h-5 w-5 mr-3" />
              Pricing
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-400 hover:bg-red-900/20 transition-colors duration-200 h-12"
              onClick={handleSignOut}
            >
              <ArrowLeft className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </nav>
        </div>
      </div>

      <div className="min-h-screen">
        {/* Mobile-optimized header */}
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentPath.length > 1 ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackNavigation}
                    className="text-white hover:bg-gray-800 transition-colors duration-200 h-10 w-10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(true)}
                    className="text-white hover:bg-gray-800 transition-colors duration-200 h-10 w-10"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                
                <Logo size="sm" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNotifications}
                  className="text-white hover:bg-gray-800 transition-colors duration-200 h-10 w-10"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUserProfile(true)}
                  className="text-white hover:bg-gray-800 transition-colors duration-200 h-10 w-10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile-optimized search */}
        <div className="px-4 py-3 bg-gray-900">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* Breadcrumb navigation */}
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

        {/* Action buttons - mobile optimized */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <Upload className="h-5 w-5" />
              <span className="text-sm font-medium">Upload Files</span>
            </Button>
            
            <Button 
              onClick={handleCreateFolder}
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 h-14 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <FolderPlus className="h-5 w-5" />
              <span className="text-sm font-medium">New Folder</span>
            </Button>
          </div>
        </div>

        {/* File list - mobile optimized */}
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

        {/* Mobile-optimized bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3 safe-area-inset-bottom">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center space-y-1 text-blue-400 hover:bg-gray-800 transition-colors duration-200 px-3 py-2"
              onClick={() => setCurrentPath(['My Files'])}
            >
              <Cloud className="h-5 w-5" />
              <span className="text-xs">Files</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 px-3 py-2"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
              <span className="text-xs">Search</span>
            </Button>
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transition-all duration-200 hover:scale-110"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowUserProfile(true)}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 px-3 py-2"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowSettings(true)}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200 px-3 py-2"
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
      />

      {/* Pricing Section Modal */}
      <Dialog open={showPricingSection} onOpenChange={setShowPricingSection}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Upgrade Your Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20`}
              >
                {plan.popular && (
                  <Badge className="mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold">{plan.name}</h3>
                    <div className="text-xl font-bold">
                      {plan.price}
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    toast({
                      title: "Plan Selected",
                      description: `You've selected the ${plan.name}. This would redirect to payment.`,
                    });
                  }}
                  className={`w-full h-10 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r ${plan.color} hover:scale-105`}
                >
                  Choose {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
