
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
        console.log('Fetching user data for:', userId);
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
        }

        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error('Settings error:', settingsError);
        }

        // Fetch storage usage
        const { data: storageData, error: storageError } = await supabase
          .from('storage_usage')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (storageError && storageError.code !== 'PGRST116') {
          console.error('Storage error:', storageError);
        }

        // Fetch subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (subscriptionError && subscriptionError.code !== 'PGRST116') {
          console.error('Subscription error:', subscriptionError);
        }

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
    if (!userId || !profile) return { success: false };

    try {
      console.log('Updating profile with:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      setProfile(data);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error };
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!userId) return { success: false };

    try {
      console.log('Updating settings with:', updates);
      
      const { data, error } = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Settings update error:', error);
        throw error;
      }

      console.log('Settings updated successfully:', data);
      setSettings(data);
      
      return { success: true };
    } catch (error) {
      console.error('Settings update failed:', error);
      return { success: false, error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!userId) return { success: false };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('Uploading avatar to:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Avatar uploaded, updating profile with URL:', publicUrl);
      
      const updateResult = await updateProfile({ avatar_url: publicUrl });
      
      if (updateResult.success) {
        return { success: true, url: publicUrl };
      } else {
        throw new Error('Failed to update profile with new avatar URL');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      return { success: false, error };
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
    uploadAvatar,
  };
};
