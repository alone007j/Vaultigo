
import { useState } from 'react';
import { Settings, Shield, Bell, Palette, Globe, Download, Trash2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    darkMode: true,
    twoFactor: true,
    publicSharing: false,
    autoDownload: false,
    language: 'en',
    theme: 'dark',
  });
  const { toast } = useToast();

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting updated",
      description: `${key} has been updated`,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-white flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="general" className="text-white">General</TabsTrigger>
          <TabsTrigger value="security" className="text-white">Security</TabsTrigger>
          <TabsTrigger value="storage" className="text-white">Storage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </Label>
                <p className="text-sm text-gray-400">Receive notifications for file changes</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <Separator className="bg-white/20" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Auto Sync</span>
                </Label>
                <p className="text-sm text-gray-400">Automatically sync files across devices</p>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
              />
            </div>

            <Separator className="bg-white/20" />

            <div className="space-y-2">
              <Label className="text-white flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Language</span>
              </Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Theme</span>
              </Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => handleSettingChange('theme', value)}
              >
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Two-Factor Authentication</span>
                </Label>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactor}
                onCheckedChange={(checked) => handleSettingChange('twoFactor', checked)}
              />
            </div>

            <Separator className="bg-white/20" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Public Sharing</Label>
                <p className="text-sm text-gray-400">Allow files to be shared publicly</p>
              </div>
              <Switch
                checked={settings.publicSharing}
                onCheckedChange={(checked) => handleSettingChange('publicSharing', checked)}
              />
            </div>

            <Separator className="bg-white/20" />

            <div className="space-y-3">
              <Label className="text-white">Security Actions</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20">
                  Sign Out All Devices
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="storage" className="space-y-4 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Auto Download</Label>
                <p className="text-sm text-gray-400">Automatically download shared files</p>
              </div>
              <Switch
                checked={settings.autoDownload}
                onCheckedChange={(checked) => handleSettingChange('autoDownload', checked)}
              />
            </div>

            <Separator className="bg-white/20" />

            <div className="space-y-3">
              <Label className="text-white">Storage Management</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/20">
                  Clear Cache
                </Button>
                <Button variant="outline" className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/20">
                  Optimize Storage
                </Button>
                <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Empty Trash
                </Button>
              </div>
            </div>

            <Separator className="bg-white/20" />

            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Storage Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Documents</span>
                  <span className="text-white">2.4 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Images</span>
                  <span className="text-white">8.7 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Videos</span>
                  <span className="text-white">4.5 GB</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-3 pt-4">
        <Button onClick={onClose} className="flex-1 bg-blue-600 hover:bg-blue-700">
          Done
        </Button>
      </div>
    </>
  );
};
