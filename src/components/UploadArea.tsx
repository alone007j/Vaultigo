
import { useCallback, useState } from 'react';
import { Upload, X, File, Image, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface UploadAreaProps {
  onFileUpload: (files: File[]) => void;
  isUploading: boolean;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  return File;
};

export const UploadArea = ({ onFileUpload, isUploading }: UploadAreaProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadFile[]>([]);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newUploadingFiles = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    
    // Simulate upload progress
    newUploadingFiles.forEach((uploadFile, index) => {
      const interval = setInterval(() => {
        setUploadingFiles(prev => {
          const updated = [...prev];
          const fileIndex = updated.findIndex(f => f.file === uploadFile.file);
          if (fileIndex !== -1) {
            updated[fileIndex].progress += Math.random() * 20;
            if (updated[fileIndex].progress >= 100) {
              updated[fileIndex].progress = 100;
              updated[fileIndex].status = 'completed';
              clearInterval(interval);
            }
          }
          return updated;
        });
      }, 200);
    });
    
    onFileUpload(files);
    
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) uploaded successfully`,
    });
  };

  const removeUploadingFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== file));
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-white/20 hover:border-white/40'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Drop files here</h3>
        <p className="text-muted-foreground mb-4">
          or click to browse your files
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Choose Files
          </label>
        </Button>
      </div>

      {uploadingFiles.length > 0 && (
        <Card className="p-4 bg-white/5 border-white/10">
          <h4 className="font-medium mb-3">Uploading files</h4>
          <div className="space-y-3">
            {uploadingFiles.map((uploadFile, index) => {
              const Icon = getFileIcon(uploadFile.file.type);
              return (
                <div key={index} className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadingFile(uploadFile.file)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={uploadFile.progress} className="flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(uploadFile.progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
