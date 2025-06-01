
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bell, Search, Upload, User, Settings, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTranslation } from "@/hooks/useTranslation";
import { UserProfile } from "@/components/UserProfile";
import { SettingsPanel } from "@/components/SettingsPanel";
import { WelcomeModal } from "@/components/WelcomeModal";
import { UploadArea } from "@/components/UploadArea";
import { Logo } from "@/components/Logo";

const Index = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user, signOut } = useAuth();
  const { profile, subscription, storageUsage, loading } = useUserProfile(user?.id || null);
  const { t } = useTranslation();

  // Check if user is new and show welcome modal
  useEffect(() => {
    if (user && !loading) {
      const hasSeenWelcome = localStorage.getItem(`welcome-seen-${user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [user, loading]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    if (user) {
      localStorage.setItem(`welcome-seen-${user.id}`, 'true');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Search functionality would be implemented here
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const storagePercentage = storageUsage 
    ? Math.round((storageUsage.used_bytes / storageUsage.total_bytes) * 100)
    : 0;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPlanIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'pro': return <Sparkles className="h-4 w-4" />;
      case 'elite': return <Crown className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getPlanColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'pro': return 'bg-blue-600 hover:bg-blue-700';
      case 'elite': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <Logo size="sm" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {t('welcome')}
              </h1>
              <p className="text-gray-300 text-sm">
                {profile?.full_name || user?.email || 'User'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`${getPlanColor(subscription?.subscription_tier || 'free')} text-white`}>
              {getPlanIcon(subscription?.subscription_tier || 'free')}
              <span className="ml-1">{subscription?.subscription_tier || 'Free'}</span>
            </Badge>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationToggle}
              className="text-white hover:bg-white/20"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfile(true)}
              className="text-white hover:bg-white/20"
            >
              <User className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/20"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>{t('uploadFiles')}</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Drag and drop files or click to upload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadArea />
              </CardContent>
            </Card>
          </div>

          {/* Storage Usage */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('storageUsage')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Used</span>
                    <span>{storagePercentage}%</span>
                  </div>
                  <Progress value={storagePercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>
                      {formatBytes(storageUsage?.used_bytes || 0)}
                    </span>
                    <span>
                      {formatBytes(storageUsage?.total_bytes || 10737418240)}
                    </span>
                  </div>
                </div>
                
                <Separator className="bg-white/20" />
                
                <div className="text-center">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Preview */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('pricing')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <span className="text-gray-300 text-sm">Free Plan</span>
                    <span className="text-white font-semibold">$0</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-600/20 rounded border border-blue-500/30">
                    <span className="text-gray-300 text-sm">Pro Plan</span>
                    <span className="text-white font-semibold">$9.99</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-600/20 rounded border border-purple-500/30">
                    <span className="text-gray-300 text-sm">Elite Plan</span>
                    <span className="text-white font-semibold">$19.99</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/pricing'}
                >
                  View All Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Files */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">{t('recentFiles')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              No files uploaded yet. Start by uploading your first file!
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="p-0 bg-transparent border-none max-w-md">
          <UserProfile onClose={() => setShowProfile(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="p-0 bg-transparent border-none max-w-md">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>

      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleWelcomeClose}
      />

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-20 right-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold">{t('notifications')}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          </div>
          <div className="text-gray-300 text-sm">
            No new notifications
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
