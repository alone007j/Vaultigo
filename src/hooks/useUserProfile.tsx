
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface UserSettings {
  id: string;
  user_id: string;
  notifications: boolean;
  auto_sync: boolean;
  theme: string;
  language: string;
  two_factor_enabled: boolean;
  public_sharing: boolean;
  auto_download: boolean;
}

interface StorageUsage {
  id: string;
  user_id: string;
  used_bytes: number;
  total_bytes: number;
}

interface Subscription {
  id: string;
  user_id: string;
  subscription_tier: string;
  subscribed: boolean;
  subscription_end: string | null;
}

export const useUserProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        // Fetch settings
        const { data: settingsData } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        // Fetch storage usage
        const { data: storageData } = await supabase
          .from('storage_usage')
          .select('*')
          .eq('user_id', userId)
          .single();

        // Fetch subscription
        const { data: subscriptionData } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', userId)
          .single();

        setProfile(profileData);
        setSettings(settingsData);
        setStorageUsage(storageData);
        setSubscription(subscriptionData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return {
    profile,
    settings,
    storageUsage,
    subscription,
    loading,
    updateProfile,
    updateSettings,
  };
};
