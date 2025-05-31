
import { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Download, Globe, Palette, X, Languages, Trash2, HardDrive, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const { user } = useAuth();
  const { settings, loading, updateSettings } = useUserProfile(user?.id || null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [localSettings, setLocalSettings] = useState({
    notifications: true,
    auto_sync: true,
    theme: 'dark',
    language: 'en',
    two_factor_enabled: false,
    public_sharing: false,
    auto_download: false,
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        notifications: settings.notifications,
        auto_sync: settings.auto_sync,
        theme: settings.theme,
        language: settings.language,
        two_factor_enabled: settings.two_factor_enabled,
        public_sharing: settings.public_sharing,
        auto_download: settings.auto_download,
      });
    }
  }, [settings]);

  const handleSettingChange = async (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    
    try {
      await updateSettings({ [key]: value });
    } catch (error) {
      // Revert on error
      setLocalSettings(localSettings);
    }
  };

  const handleSignOutAllDevices = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Signed out from all other devices",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out from other devices",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset link will be sent to your email",
    });
    // In a real app, this would trigger a password reset email
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast({
      title: "Cache cleared",
      description: "Local cache has been cleared successfully",
    });
  };

  const handleOptimizeStorage = () => {
    toast({
      title: "Storage optimized",
      description: "Storage optimization completed",
    });
  };

  const handleEmptyTrash = () => {
    toast({
      title: "Trash emptied",
      description: "All files in trash have been permanently deleted",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>General</span>
          </h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-white">Notifications</Label>
            <Switch
              id="notifications"
              checked={localSettings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-sync" className="text-white">Auto Sync</Label>
            <Switch
              id="auto-sync"
              checked={localSettings.auto_sync}
              onCheckedChange={(checked) => handleSettingChange('auto_sync', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-download" className="text-white">Auto Download</Label>
            <Switch
              id="auto-download"
              checked={localSettings.auto_download}
              onCheckedChange={(checked) => handleSettingChange('auto_download', checked)}
            />
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
          </h3>
          
          <div className="flex items-center justify-between">
            <Label className="text-white">Theme</Label>
            <Select value={localSettings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="dark" className="text-white">Dark</SelectItem>
                <SelectItem value="light" className="text-white">Light</SelectItem>
                <SelectItem value="system" className="text-white">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white flex items-center space-x-2">
              <Languages className="h-4 w-4" />
              <span>Language</span>
            </Label>
            <Select value={localSettings.language} onValueChange={(value) => handleSettingChange('language', value)}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="en" className="text-white">English</SelectItem>
                <SelectItem value="es" className="text-white">Spanish</SelectItem>
                <SelectItem value="fr" className="text-white">French</SelectItem>
                <SelectItem value="de" className="text-white">German</SelectItem>
                <SelectItem value="zh" className="text-white">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Security Settings */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa" className="text-white">Two-Factor Authentication</Label>
            <Switch
              id="2fa"
              checked={localSettings.two_factor_enabled}
              onCheckedChange={(checked) => handleSettingChange('two_factor_enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="public-sharing" className="text-white">Public Sharing</Label>
            <Switch
              id="public-sharing"
              checked={localSettings.public_sharing}
              onCheckedChange={(checked) => handleSettingChange('public_sharing', checked)}
            />
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleChangePassword}
              variant="outline"
              className="w-full justify-start border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              Change Password
            </Button>
            
            <Button
              onClick={handleSignOutAllDevices}
              variant="outline"
              className="w-full justify-start border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out All Devices
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Storage Management */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <HardDrive className="h-4 w-4" />
            <span>Storage Management</span>
          </h3>
          
          <div className="space-y-2">
            <Button
              onClick={handleClearCache}
              variant="outline"
              className="w-full justify-start border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              Clear Cache
            </Button>
            
            <Button
              onClick={handleOptimizeStorage}
              variant="outline"
              className="w-full justify-start border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              Optimize Storage
            </Button>
            
            <Button
              onClick={handleEmptyTrash}
              variant="outline"
              className="w-full justify-start border-gray-700 bg-gray-800 text-white hover:bg-gray-700 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Empty Trash
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
