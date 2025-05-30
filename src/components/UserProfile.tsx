
import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Edit, Camera, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile = ({ onClose }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    plan: 'Premium',
    avatar: localStorage.getItem('userAvatar') || '',
  });
  const { toast } = useToast();

  // Load avatar from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUserInfo(prev => ({
        ...prev,
        avatar: savedAvatar
      }));
    }
  }, []);

  const handleSave = () => {
    // Save avatar to localStorage for persistence
    localStorage.setItem('userAvatar', userInfo.avatar);
    
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated and saved",
    });
  };

  const handleCancel = () => {
    // Restore avatar from localStorage if cancelled
    const savedAvatar = localStorage.getItem('userAvatar') || '';
    setUserInfo(prev => ({
      ...prev,
      avatar: savedAvatar
    }));
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUserInfo(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Profile</span>
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
      
      <div className="space-y-6 py-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-blue-600">
              <AvatarImage src={userInfo.avatar} />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
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
              {userInfo.plan} Plan
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
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 transition-colors duration-200"
              />
            ) : (
              <p className="text-white bg-gray-800 px-3 py-2 rounded-md">{userInfo.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 transition-colors duration-200"
              />
            ) : (
              <p className="text-white bg-gray-800 px-3 py-2 rounded-md">{userInfo.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Member Since</span>
            </Label>
            <p className="text-white bg-gray-800 px-3 py-2 rounded-md">{userInfo.joinDate}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Account Security</span>
            </Label>
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-md">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Two-factor authentication enabled</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
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
    </>
  );
};
