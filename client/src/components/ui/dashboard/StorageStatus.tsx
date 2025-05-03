import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface StorageStatusProps {
  used: number;
  total: number;
}

export default function StorageStatus({ used, total }: StorageStatusProps) {
  // Calculate percentage used
  const percentUsed = Math.min(100, Math.round((used / total) * 100));
  
  // Format storage values
  const formatStorage = (gb: number) => {
    if (gb >= 1000) {
      return `${(gb / 1024).toFixed(1)} TB`;
    }
    return `${gb.toFixed(1)} GB`;
  };
  
  return (
    <Card className="bg-primary-900/60 backdrop-blur-sm border-muted/30">
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">Storage Used</span>
          <span className="text-sm font-medium text-foreground">
            {formatStorage(used)} / {formatStorage(total)}
          </span>
        </div>
        <div className="h-2 relative rounded-full overflow-hidden">
          <Progress value={percentUsed} className="h-2" />
        </div>
        
        {/* Add warning if storage nearly full */}
        {percentUsed > 90 && (
          <p className="text-xs text-destructive mt-2">
            Your storage is almost full. Consider upgrading your plan or deleting unused files.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
