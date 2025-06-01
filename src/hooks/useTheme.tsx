
import { useState, useEffect, useContext, createContext } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState('dark');

  const setTheme = (newTheme: string) => {
    console.log('Setting theme to:', newTheme);
    setThemeState(newTheme);
    localStorage.setItem('vaultigo-theme', newTheme);
    
    // Apply theme to document root
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'light') {
      root.classList.add('light');
      document.body.style.backgroundColor = '#ffffff';
    } else if (newTheme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
      document.body.style.backgroundColor = prefersDark ? '#0f172a' : '#ffffff';
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('vaultigo-theme') || 'dark';
    console.log('Loading saved theme:', savedTheme);
    setTheme(savedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
