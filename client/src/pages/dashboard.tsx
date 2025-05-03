import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/ui/dashboard/Sidebar";
import StorageStatus from "@/components/ui/dashboard/StorageStatus";
import CategoryCard from "@/components/ui/dashboard/CategoryCard";
import RecentFile from "@/components/ui/dashboard/RecentFile";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Search, Upload, MoreHorizontal, Plus } from "lucide-react";
import AiAssistant from "@/components/ui/AiAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import FileExplorer from "@/components/ui/dashboard/FileExplorer";

export default function Dashboard() {
  const { user } = useAuth();
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Fetch recent files
  const { data: recentFiles = [] } = useQuery({
    queryKey: ["/api/files/recent"],
  });

  // Fetch files by type for categories
  const { data: imageFiles = [] } = useQuery({
    queryKey: ["/api/files/type/image"],
  });
  
  const { data: documentFiles = [] } = useQuery({
    queryKey: ["/api/files/type/document"],
  });
  
  const { data: videoFiles = [] } = useQuery({
    queryKey: ["/api/files/type/video"],
  });
  
  const { data: audioFiles = [] } = useQuery({
    queryKey: ["/api/files/type/audio"],
  });

  // Calculate sizes for categories
  const calculateSize = (files: any[]) => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const categories = [
    {
      name: "Images",
      icon: "image",
      size: calculateSize(imageFiles),
      count: imageFiles.length,
    },
    {
      name: "Documents",
      icon: "file-text",
      size: calculateSize(documentFiles),
      count: documentFiles.length,
    },
    {
      name: "Videos",
      icon: "film",
      size: calculateSize(videoFiles),
      count: videoFiles.length,
    },
    {
      name: "Audio",
      icon: "music",
      size: calculateSize(audioFiles),
      count: audioFiles.length,
    },
  ];

  const toggleAiAssistant = () => {
    setShowAiAssistant(!showAiAssistant);
  };

  return (
    <div className="flex h-screen bg-primary overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <div className="bg-primary/60 backdrop-blur-md border-b border-muted/20 h-16 flex items-center justify-between px-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full h-9 bg-secondary/50 rounded-full pl-10 pr-4 text-sm focus:outline-none glow-border"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={toggleAiAssistant}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M14.5 9.5 12 12m0 0-2.5 2.5M12 12l-2.5-2.5M12 12l2.5 2.5" />
              </svg>
            </Button>
            <div className="h-6 w-px bg-muted/20"></div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-sm text-muted-foreground border-muted/30"
            >
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <div className="border-b border-muted/20 px-6">
            <TabsList className="h-12">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview tab */}
          <TabsContent value="overview" className="flex-1 overflow-auto p-6">
            <div className="space-y-8">
              {/* Storage status */}
              <StorageStatus
                used={user?.storageUsed || 0}
                total={user?.storage || 10}
              />

              {/* File categories */}
              <div>
                <h2 className="text-lg font-medium mb-4">Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.name}
                      name={category.name}
                      icon={category.icon}
                      size={category.size}
                      count={category.count}
                    />
                  ))}
                </div>
              </div>

              {/* Recent files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Recent Files</h2>
                  <Button variant="link" className="text-accent-blue">
                    View all
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentFiles.length > 0 ? (
                    recentFiles.map((file: any) => (
                      <RecentFile
                        key={file.id}
                        name={file.name}
                        type={file.type}
                        size={file.size}
                        createdAt={file.createdAt}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No recent files found</p>
                      <Button className="mt-4 ripple hover-glow bg-accent-blue">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Files tab */}
          <TabsContent value="files" className="flex-1 overflow-auto p-6">
            <FileExplorer />
          </TabsContent>

          {/* Shared tab */}
          <TabsContent value="shared" className="flex-1 overflow-auto p-6">
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
                <path d="M17 8h.5a3.5 3.5 0 0 1 0 7H17" />
                <path d="M6.5 15H6a3 3 0 0 1 0-6h.5" />
                <path d="M7 11h10" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No shared files yet</h3>
              <p className="max-w-sm mx-auto mb-6">
                Share your files with others or get access to files shared with you.
              </p>
              <Button className="ripple hover-glow bg-accent-blue">
                Share a file
              </Button>
            </div>
          </TabsContent>

          {/* Starred tab */}
          <TabsContent value="starred" className="flex-1 overflow-auto p-6">
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No starred files yet</h3>
              <p className="max-w-sm mx-auto">
                Star your most important files to access them quickly.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant */}
      {showAiAssistant && (
        <div className="fixed bottom-6 right-6 w-96 z-50">
          <AiAssistant onClose={toggleAiAssistant} />
        </div>
      )}
    </div>
  );
}
