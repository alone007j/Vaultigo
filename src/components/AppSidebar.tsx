
import { useState } from 'react';
import { 
  Files, 
  Settings, 
  CreditCard, 
  MessageCircle, 
  User, 
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  Trash2
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  fileCount?: number;
}

export const AppSidebar = ({ activeSection, onSectionChange, fileCount = 0 }: AppSidebarProps) => {
  const { user } = useAuth();
  const { profile, subscription } = useUserProfile(user?.id || null);
  const { state } = useSidebar();

  const menuItems = [
    {
      id: 'files',
      title: 'My Files',
      icon: Files,
      badge: fileCount > 0 ? fileCount.toString() : undefined
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: User
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings
    },
    {
      id: 'pricing',
      title: 'Pricing',
      icon: CreditCard
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: MessageCircle
    }
  ];

  const getPlanColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'pro': return 'bg-blue-500';
      case 'elite': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Sidebar className="border-r border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-800">
      <SidebarHeader className="p-4 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-blue-600 text-white">
              {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </AvatarFallback>
          </Avatar>
          {state === 'expanded' && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.full_name || 'User'}
              </p>
              <Badge className={`${getPlanColor(subscription?.subscription_tier || 'free')} text-white text-xs`}>
                {subscription?.subscription_tier || 'Free'}
              </Badge>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onSectionChange(item.id)}
                  isActive={activeSection === item.id}
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto bg-blue-500 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 text-center">
          Vaultigo Cloud Storage
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
