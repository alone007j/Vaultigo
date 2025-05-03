import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Image,
  Music,
  Film,
  File,
  Download,
  Star,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RecentFileProps {
  id?: number;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  isStarred?: boolean;
  onDelete?: (id: number) => void;
}

export default function RecentFile({
  id,
  name,
  type,
  size,
  createdAt,
  isStarred = false,
  onDelete
}: RecentFileProps) {
  const { toast } = useToast();

  // Format the file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };
  
  // Format the date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };
  
  // Get icon based on file type
  const getIcon = () => {
    switch (type) {
      case "document":
        return FileText;
      case "image":
        return Image;
      case "audio":
        return Music;
      case "video":
        return Film;
      default:
        return File;
    }
  };
  
  const IconComponent = getIcon();

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: number) => {
      await apiRequest("DELETE", `/api/files/${fileId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      queryClient.invalidateQueries({ queryKey: [`/api/files/type/${type}`] });
      toast({
        title: "File deleted",
        description: `${name} has been deleted.`,
      });
      if (onDelete && id) {
        onDelete(id);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };
  
  return (
    <div className="bg-primary-900/60 backdrop-blur-sm p-3 rounded-xl flex justify-between items-center border border-muted/30 group">
      <div className="flex items-center space-x-3">
        <div className="bg-secondary p-2 rounded-lg">
          <IconComponent className="text-accent-cyan h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground text-sm font-medium">{name}</p>
          <p className="text-muted-foreground text-xs">
            {formatSize(size)} • {formatDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Download className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              <span>{isStarred ? "Unstar" : "Star"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              <span>Download</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <svg 
                  className="mr-2 h-4 w-4 animate-spin" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              )}
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
