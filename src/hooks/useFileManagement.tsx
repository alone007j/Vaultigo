
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string; // Adding type property for compatibility
  mimeType: string;
  modifiedAt: Date;
  uploadedAt: Date;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const useFileManagement = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadFile = async (file: File): Promise<FileItem | null> => {
    if (!user) return null;

    const fileId = `${Date.now()}-${file.name}`;
    const filePath = `${user.id}/${fileId}`;

    try {
      // Add file to state immediately with uploading status
      const newFile: FileItem = {
        id: fileId,
        name: file.name,
        url: '',
        size: file.size,
        type: file.type,
        mimeType: file.type,
        modifiedAt: new Date(),
        uploadedAt: new Date(),
        isUploading: true,
        uploadProgress: 0
      };

      setFiles(prev => [...prev, newFile]);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileId && f.uploadProgress! < 90) {
            return { ...f, uploadProgress: f.uploadProgress! + Math.random() * 20 };
          }
          return f;
        }));
      }, 500);

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('user-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-files')
        .getPublicUrl(filePath);

      // Update file with URL and remove uploading status
      const completedFile: FileItem = {
        ...newFile,
        url: publicUrl,
        isUploading: false,
        uploadProgress: 100
      };

      setFiles(prev => prev.map(f => f.id === fileId ? completedFile : f));

      // Store file metadata in database
      const { error: dbError } = await supabase
        .from('user_files')
        .insert({
          id: fileId,
          user_id: user.id,
          name: file.name,
          url: publicUrl,
          size: file.size,
          mime_type: file.type,
          file_path: filePath
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Still show success since file is uploaded to storage
      }

      toast({
        title: "Success",
        description: `${file.name} uploaded successfully!`,
      });

      // Remove upload progress after a short delay
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, isUploading: false, uploadProgress: undefined } : f
        ));
      }, 2000);

      return completedFile;
    } catch (error) {
      console.error('Upload error:', error);
      
      // Remove failed upload from state
      setFiles(prev => prev.filter(f => f.id !== fileId));
      
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}. Please try again.`,
        variant: "destructive",
      });
      
      return null;
    }
  };

  const downloadFile = async (file: FileItem) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `Downloading ${file.name}...`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!user) return;

    try {
      // Get file info first
      const { data: fileData } = await supabase
        .from('user_files')
        .select('file_path')
        .eq('id', fileId)
        .eq('user_id', user.id)
        .single();

      if (fileData) {
        // Delete from storage
        await supabase.storage
          .from('user-files')
          .remove([fileData.file_path]);

        // Delete from database
        await supabase
          .from('user_files')
          .delete()
          .eq('id', fileId)
          .eq('user_id', user.id);
      }

      // Remove from state
      setFiles(prev => prev.filter(f => f.id !== fileId));

      toast({
        title: "File Deleted",
        description: "File has been successfully deleted.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadFiles = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const loadedFiles: FileItem[] = (data || []).map(file => ({
        id: file.id,
        name: file.name,
        url: file.url,
        size: file.size,
        type: file.mime_type,
        mimeType: file.mime_type,
        modifiedAt: new Date(file.updated_at || file.created_at),
        uploadedAt: new Date(file.created_at)
      }));

      setFiles(loadedFiles);
    } catch (error) {
      console.error('Load files error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  return {
    files,
    loading,
    uploadFile,
    downloadFile,
    deleteFile,
    refreshFiles: loadFiles
  };
};
