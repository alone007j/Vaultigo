
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  url: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useFileManagement = (userId: string | null) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchFiles();
  }, [userId]);

  const fetchFiles = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching files:', error);
        toast({
          title: "Error",
          description: "Failed to load files",
          variant: "destructive",
        });
        return;
      }

      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('user_files')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('Error deleting file:', error);
        toast({
          title: "Error",
          description: "Failed to delete file",
          variant: "destructive",
        });
        return;
      }

      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const downloadFile = async (file: FileItem) => {
    try {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const previewFile = (file: FileItem) => {
    window.open(file.url, '_blank');
  };

  return {
    files,
    loading,
    deleteFile,
    downloadFile,
    previewFile,
    refreshFiles: fetchFiles,
  };
};
