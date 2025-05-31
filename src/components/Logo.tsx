
import { Cloud } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center ${sizes[size]}`}>
        <Cloud className={`h-${size === 'sm' ? '4' : size === 'md' ? '5' : '8'} w-${size === 'sm' ? '4' : size === 'md' ? '5' : '8'} text-white`} />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent ${textSizes[size]}`}>
          Vaultigo
        </span>
      )}
    </div>
  );
};
