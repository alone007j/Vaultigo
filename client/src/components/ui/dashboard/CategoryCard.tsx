import { 
  FileText, 
  Image, 
  Music, 
  Film, 
  File,
  LucideIcon
} from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: string;
  size: number;
  count: number;
}

export default function CategoryCard({ name, icon, size, count }: CategoryCardProps) {
  // Format the size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };
  
  // Map icon string to Lucide component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "file-text":
        return FileText;
      case "image":
        return Image;
      case "music":
        return Music;
      case "film":
        return Film;
      default:
        return File;
    }
  };
  
  const IconComponent = getIcon(icon);
  
  return (
    <div className="card-lift bg-primary-900/60 backdrop-blur-sm rounded-xl p-3 border border-muted/30 flex items-center space-x-3">
      <div className="bg-accent-blue/20 p-2 rounded-lg">
        <IconComponent className="text-accent-cyan h-5 w-5" />
      </div>
      <div>
        <p className="text-foreground text-sm font-medium">{name}</p>
        <p className="text-muted-foreground text-xs">
          {formatSize(size)} • {count} {count === 1 ? 'file' : 'files'}
        </p>
      </div>
    </div>
  );
}
