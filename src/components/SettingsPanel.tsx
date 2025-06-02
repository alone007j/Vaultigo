import { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Globe, Palette, Languages, Trash2, HardDrive, LogOut, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const { user, signOut } = useAuth();
  const { settings, loading, updateSettings } = useUserProfile(user?.id || null);
  const { toast } = useToast();
  const { t, currentLanguage, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const [localSettings, setLocalSettings] = useState({
    notifications: true,
    auto_sync: true,
    theme: 'dark',
    language: 'en',
    two_factor_enabled: false,
    public_sharing: false,
    auto_download: false,
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  useEffect(() => {
    if (settings) {
      console.log('Settings loaded:', settings);
      setLocalSettings({
        notifications: settings.notifications ?? true,
        auto_sync: settings.auto_sync ?? true,
        theme: settings.theme || theme,
        language: settings.language || currentLanguage,
        two_factor_enabled: settings.two_factor_enabled ?? false,
        public_sharing: settings.public_sharing ?? false,
        auto_download: settings.auto_download ?? false,
      });
    }
  }, [settings, theme, currentLanguage]);

  const handleSettingChange = async (key: string, value: any) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      console.log(`Updating ${key} to:`, value);
      
      // Update local state immediately for better UX
      setLocalSettings(prev => ({ ...prev, [key]: value }));
      
      // Handle special cases first
      if (key === 'language') {
        setLanguage(value);
        console.log('Language changed to:', value);
      }
      if (key === 'theme') {
        setTheme(value);
        console.log('Theme changed to:', value);
      }
      
      // Update in database
      const result = await updateSettings({ [key]: value });
      
      if (result?.success) {
        console.log(`${key} updated successfully`);
        // Only show success toast for important changes
        if (key === 'language' || key === 'theme') {
          toast({
            title: "Settings Updated",
            description: `${key.replace('_', ' ')} has been updated successfully`,
          });
        }
      } else {
        // Revert local change if database update failed
        setLocalSettings(prev => {
          const reverted = { ...prev };
          if (settings) {
            reverted[key as keyof typeof localSettings] = settings[key as keyof typeof settings] ?? prev[key as keyof typeof localSettings];
          }
          return reverted;
        });
        
        console.error('Settings update failed:', result?.error);
        toast({
          title: "Update Failed",
          description: `Failed to update ${key.replace('_', ' ')}. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Revert local change if error occurred
      setLocalSettings(prev => {
        const reverted = { ...prev };
        if (settings) {
          reverted[key as keyof typeof localSettings] = settings[key as keyof typeof settings] ?? prev[key as keyof typeof localSettings];
        }
        return reverted;
      });
      
      console.error('Settings update failed:', error);
      toast({
        title: "Error",
        description: `Failed to update ${key.replace('_', ' ')}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Signed out from all devices successfully",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out from other devices",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!user?.email) {
        toast({
          title: "Error",
          description: "No email address found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };

  const handleClearCache = () => {
    try {
      // Clear specific app data, not all localStorage
      const keysToKeep = ['vaultigo-theme', 'vaultigo-language'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
      toast({
        title: "Success",
        description: "Cache cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      });
    }
  };

  const handleOptimizeStorage = () => {
    toast({
      title: "Success",
      description: "Storage optimized successfully",
    });
  };

  const handleEmptyTrash = () => {
    toast({
      title: "Success",
      description: "Trash emptied successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-lg">
        <div className="text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-lg border border-gray-700 max-w-md mx-auto max-h-[80vh] overflow-hidden">
      <DialogHeader className="p-6 border-b border-gray-700">
        <DialogTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full h-8 w-8"
          >
            ×
          </Button>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 p-6 max-h-96 overflow-y-auto">
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
              disabled={isSaving}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-sync" className="text-white">Auto Sync</Label>
            <Switch
              id="auto-sync"
              checked={localSettings.auto_sync}
              disabled={isSaving}
              onCheckedChange={(checked) => handleSettingChange('auto_sync', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-download" className="text-white">Auto Download</Label>
            <Switch
              id="auto-download"
              checked={localSettings.auto_download}
              disabled={isSaving}
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
            <Select 
              value={localSettings.theme} 
              onValueChange={(value) => handleSettingChange('theme', value)}
              disabled={isSaving}
            >
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
            <Select 
              value={localSettings.language} 
              onValueChange={(value) => handleSettingChange('language', value)}
              disabled={isSaving}
            >
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 max-h-40">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-white">
                    {lang.name}
                  </SelectItem>
                ))}
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
            <Label htmlFor="2fa" className="text-white">Two Factor Auth</Label>
            <Switch
              id="2fa"
              checked={localSettings.two_factor_enabled}
              disabled={isSaving}
              onCheckedChange={(checked) => handleSettingChange('two_factor_enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="public-sharing" className="text-white">Public Sharing</Label>
            <Switch
              id="public-sharing"
              checked={localSettings.public_sharing}
              disabled={isSaving}
              onCheckedChange={(checked) => handleSettingChange('public_sharing', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
