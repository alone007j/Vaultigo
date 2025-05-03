import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Cloud,
  Moon,
  Sun,
  HelpCircle,
  Folder,
  Star,
  Share2,
  Upload,
  Trash2,
  ChevronRight,
  Database,
  LifeBuoy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  // Calculate storage percentage
  const storagePercentage = user
    ? Math.min(100, Math.round((user.storageUsed / user.storage) * 100))
    : 0;

  // Format storage
  const formatStorage = (gb: number) => {
    if (gb >= 1000) {
      return `${(gb / 1024).toFixed(1)} TB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  const sidebarLinks = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "My Files",
      icon: Folder,
      path: "/dashboard/files",
    },
    {
      name: "Starred",
      icon: Star,
      path: "/dashboard/starred",
    },
    {
      name: "Shared",
      icon: Share2,
      path: "/dashboard/shared",
    },
    {
      name: "Trash",
      icon: Trash2,
      path: "/dashboard/trash",
    },
  ];

  return (
    <div className="w-64 border-r border-muted/20 bg-sidebar h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-muted/20">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-cyan rounded-full blur-sm opacity-40"></div>
              <div className="relative bg-sidebar-accent rounded-full p-1.5">
                <Cloud className="text-accent-cyan h-5 w-5" />
              </div>
            </div>
            <span className="font-poppins font-bold text-xl text-sidebar-foreground">
              Vaultigo
            </span>
          </a>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location === link.path;
            return (
              <li key={link.name}>
                <Link href={link.path}>
                  <a
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <link.icon className="h-5 w-5 mr-3" />
                    <span>{link.name}</span>
                    {link.name === "Shared" && (
                      <Badge className="ml-auto bg-accent-blue text-white">New</Badge>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <div className="px-3">
            <h3 className="text-xs uppercase text-sidebar-foreground/60 font-semibold mb-3">
              External Storage
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                >
                  <svg 
                    className="h-5 w-5 mr-3 text-accent-cyan" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.01 16.24L4.76 13L3.35 14.41L8.01 19.07L20.66 6.42L19.25 5.01L8.01 16.24Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Dropbox</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-sidebar-foreground/60" />
                </a>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground/60 px-3 py-2"
                >
                  <svg 
                    className="h-5 w-5 mr-3" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4V20M20 12H4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Connect Storage</span>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Storage indicator */}
      <div className="p-4 border-t border-muted/20">
        <div className="flex items-center mb-1">
          <Database className="h-4 w-4 text-sidebar-foreground/60 mr-2" />
          <span className="text-xs text-sidebar-foreground/60">Storage</span>
          <span className="ml-auto text-xs font-medium text-sidebar-foreground">
            {user ? formatStorage(user.storageUsed) : "0 GB"} /{" "}
            {user ? formatStorage(user.storage) : "10 GB"}
          </span>
        </div>
        <Progress value={storagePercentage} className="h-1.5" />

        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-sidebar-border/60 text-sidebar-foreground"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span>Upload files</span>
          </Button>
        </div>
      </div>

      {/* User menu */}
      <div className="p-4 border-t border-muted/20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <div className="flex items-center w-full">
                <div className="h-8 w-8 rounded-full bg-accent-blue flex items-center justify-center text-white font-medium mr-2">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.plan.charAt(0).toUpperCase() + user?.plan.slice(1)} Plan
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Theme</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="text-destructive focus:text-destructive"
            >
              {logoutMutation.isPending ? (
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
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
