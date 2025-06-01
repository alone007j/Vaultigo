import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Edit, Camera, Save, Crown, Sparkles, CheckCircle } from 'lucide-react';
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
      
      if (avatarFile) {
        console.log('Uploading avatar...');
        const uploadResult = await uploadAvatar(avatarFile);
        if (uploadResult.success) {
          avatarUrl = uploadResult.url;
          setAvatarPreview(uploadResult.url || '');
          console.log('Avatar uploaded successfully:', uploadResult.url);
          toast({
            title: "Success",
            description: "Avatar uploaded successfully!",
          });
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
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Avatar file size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
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

  const getPlanDetails = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'pro':
        return { 
          icon: <Sparkles className="h-4 w-4" />, 
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/50',
          textColor: 'text-blue-400'
        };
      case 'elite':
        return { 
          icon: <Crown className="h-4 w-4" />, 
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
          borderColor: 'border-purple-500/50',
          textColor: 'text-purple-400'
        };
      default:
        return { 
          icon: <User className="h-4 w-4" />, 
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20',
          borderColor: 'border-gray-500/50',
          textColor: 'text-gray-400'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl border border-slate-700/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <div className="text-slate-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  const planDetails = getPlanDetails(subscription?.subscription_tier || 'free');

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md mx-auto overflow-hidden">
      {/* Header with gradient overlay */}
      <div className="relative">
        <div className={`h-24 bg-gradient-to-r ${planDetails.color} opacity-80`}></div>
        
        {/* Avatar positioned over header */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-white/20 ring-offset-4 ring-offset-slate-900 shadow-xl">
              <AvatarImage src={avatarPreview} alt="Profile picture" className="object-cover" />
              <AvatarFallback className={`${planDetails.bgColor} ${planDetails.textColor} text-2xl font-bold border-2 ${planDetails.borderColor}`}>
                {formData.full_name ? formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-lg">
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
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-6 px-6 space-y-6">
        {/* Plan Badge */}
        <div className="text-center">
          <Badge className={`${planDetails.bgColor} ${planDetails.textColor} border ${planDetails.borderColor} px-4 py-2 text-sm font-medium`}>
            {planDetails.icon}
            <span className="ml-2 capitalize">{subscription?.subscription_tier || 'Free'} Plan</span>
          </Badge>
        </div>

        <Separator className="bg-slate-700/50" />

        {/* Profile Fields */}
        <div className="space-y-5">
          {/* Full Name */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-slate-300 flex items-center space-x-2 text-sm font-medium">
              <User className="h-4 w-4 text-blue-400" />
              <span>Full Name</span>
            </Label>
            {isEditing ? (
              <div className="relative">
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="bg-slate-800/80 border-slate-600/50 text-white focus:border-blue-500 focus:ring-blue-500/20 rounded-xl pl-4 pr-4 py-3 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700/50 px-4 py-3 rounded-xl">
                <p className="text-white font-medium">{formData.full_name || 'Not set'}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-slate-300 flex items-center space-x-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>Email Address</span>
            </Label>
            <div className="bg-slate-800/50 border border-slate-700/50 px-4 py-3 rounded-xl flex items-center justify-between">
              <p className="text-white font-medium">{user?.email || 'Not set'}</p>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          </div>

          {/* Member Since */}
          <div className="space-y-3">
            <Label className="text-slate-300 flex items-center space-x-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>Member Since</span>
            </Label>
            <div className="bg-slate-800/50 border border-slate-700/50 px-4 py-3 rounded-xl">
              <p className="text-white font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Account Security */}
          <div className="space-y-3">
            <Label className="text-slate-300 flex items-center space-x-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-blue-400" />
              <span>Account Security</span>
            </Label>
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 px-4 py-3 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Account Secured</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700/50" />

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 rounded-xl py-3 font-medium shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSaving}
                className="border-slate-600/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 rounded-xl py-3"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 hover:scale-105 rounded-xl py-3 font-medium shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
