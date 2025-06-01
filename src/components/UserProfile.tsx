
import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Edit, Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTranslation } from '@/hooks/useTranslation';

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile = ({ onClose }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { profile, subscription, loading, updateProfile, uploadAvatar } = useUserProfile(user?.id || null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });

  useEffect(() => {
    if (profile) {
      console.log('Profile loaded:', profile);
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
      });
      setAvatarPreview(profile.avatar_url || '');
    }
  }, [profile, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving profile changes...');
      
      let avatarUrl = profile?.avatar_url;
      
      // Upload avatar if a new file was selected
      if (avatarFile) {
        console.log('Uploading avatar...');
        const uploadResult = await uploadAvatar(avatarFile);
        if (uploadResult.success) {
          avatarUrl = uploadResult.url;
          setAvatarPreview(uploadResult.url || '');
          console.log('Avatar uploaded successfully:', uploadResult.url);
        } else {
          console.error('Avatar upload failed:', uploadResult.error);
          toast({
            title: "Error",
            description: "Failed to upload avatar. Please try again.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
      }

      // Update profile data
      console.log('Updating profile data:', formData);
      const result = await updateProfile({
        full_name: formData.full_name,
        email: formData.email,
        ...(avatarUrl && { avatar_url: avatarUrl })
      });

      if (result.success) {
        setIsEditing(false);
        setAvatarFile(null);
        console.log('Profile updated successfully');
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      } else {
        console.error('Profile update failed:', result.error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile save error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
      });
      setAvatarPreview(profile.avatar_url || '');
    }
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Avatar file selected:', file.name, file.size);
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Avatar file size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-lg">
        <div className="text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-lg border border-gray-700 max-w-md mx-auto">
      <DialogHeader className="p-6 border-b border-gray-700">
        <DialogTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Profile</span>
          </div>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-blue-600">
              <AvatarImage src={avatarPreview} alt="Profile picture" />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {formData.full_name ? formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-200 hover:scale-110">
                <Camera className="h-3 w-3 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
          
          <div className="text-center">
            <Badge className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
              {subscription?.subscription_tier || 'Free'} Plan
            </Badge>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Full Name</span>
            </Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-white bg-gray-800 px-3 py-2 rounded-md">{formData.full_name || 'Not set'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </Label>
            <p className="text-white bg-gray-800 px-3 py-2 rounded-md">{user?.email || 'Not set'}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Member Since</span>
            </Label>
            <p className="text-white bg-gray-800 px-3 py-2 rounded-md">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Account Security</span>
            </Label>
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-md">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Account secured</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSaving}
                className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setIsEditing(true)} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
