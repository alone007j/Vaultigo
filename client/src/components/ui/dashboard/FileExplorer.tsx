import { useQuery } from "@tanstack/react-query";
import RecentFile from "./RecentFile";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function FileExplorer() {
  const { toast } = useToast();
  const [deletedFiles, setDeletedFiles] = useState<number[]>([]);

  // Fetch all files
  const { data: files = [], isLoading } = useQuery({
    queryKey: ["/api/files"],
  });

  // Filter out deleted files
  const filteredFiles = files.filter((file: any) => !deletedFiles.includes(file.id));

  const handleDelete = (id: number) => {
    setDeletedFiles([...deletedFiles, id]);
  };

  // Handle file upload (mock for this implementation)
  const handleUpload = () => {
    toast({
      title: "Upload functionality",
      description: "File upload would be implemented with Multer on the backend.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">All Files</h2>
        <Button className="ripple hover-glow bg-accent-blue" onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <div className="space-y-3">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file: any) => (
            <RecentFile
              key={file.id}
              id={file.id}
              name={file.name}
              type={file.type}
              size={file.size}
              createdAt={file.createdAt}
              isStarred={file.isStarred}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No files uploaded yet</h3>
            <p className="max-w-sm mx-auto mb-6">
              Upload your first file to get started with Vaultigo cloud storage.
            </p>
            <Button className="ripple hover-glow bg-accent-blue" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
