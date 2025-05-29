
import { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit, Camera } from 'lucide-react';
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
    avatar: '',
  });
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserInfo(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-white flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>User Profile</span>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userInfo.avatar} />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
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
            <Badge className="bg-blue-600 hover:bg-blue-700">
              {userInfo.plan} Plan
            </Badge>
          </div>
        </div>

        <Separator className="bg-white/20" />

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
                className="bg-white/10 border-white/30 text-white"
              />
            ) : (
              <p className="text-white bg-white/10 px-3 py-2 rounded-md">{userInfo.name}</p>
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
                className="bg-white/10 border-white/30 text-white"
              />
            ) : (
              <p className="text-white bg-white/10 px-3 py-2 rounded-md">{userInfo.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Member Since</span>
            </Label>
            <p className="text-white bg-white/10 px-3 py-2 rounded-md">{userInfo.joinDate}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Account Security</span>
            </Label>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">Two-factor authentication enabled</span>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="border-white/30 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setIsEditing(true)} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/20"
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
