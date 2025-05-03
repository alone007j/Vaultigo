import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "AI", href: "/#ai" },
    { label: "FAQ", href: "/#faq" },
  ];

  const isHomePage = location === "/";
  const isDashboard = location.includes("/dashboard");

  return (
    <header className="bg-primary/60 backdrop-blur-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-cyan rounded-full blur-sm opacity-40"></div>
            <div className="relative bg-secondary rounded-full p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-accent-cyan h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
          </div>
          <Link href="/" className="font-poppins font-bold text-xl text-foreground">
            Vaultigo
          </Link>
        </div>

        {/* Navigation - Desktop */}
        {!isDashboard && (
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="font-poppins text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons */}
          <Link 
            href="/auth" 
            className="hidden md:block text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Log in
          </Link>
          <Link 
            href="/auth"
            className="ripple hover-glow bg-accent-blue text-white text-sm font-medium py-2 px-4 rounded-2xl transition-all"
          >
            Sign Up
          </Link>
          
          {/* Mobile menu toggle */}
          <button 
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && !isDashboard && (
        <div className="md:hidden bg-primary/90 backdrop-blur-md py-4 px-4 absolute w-full">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="font-poppins text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              href="/auth"
              className="font-poppins text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
