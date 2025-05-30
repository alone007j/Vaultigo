
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Military-grade encryption',
    },
    {
      icon: '⚡',
      title: 'Fast',
      description: 'Lightning-fast sync speeds',
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Smart organization',
    },
    {
      icon: '☁️',
      title: 'Unlimited',
      description: 'Scalable storage',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative">
      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-xl font-bold">Vaultigo</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 px-6 py-8">
            <nav className="space-y-6">
              <Button
                variant="ghost"
                className="w-full justify-start text-white text-lg hover:bg-white/10 py-6"
                onClick={() => navigate('/pricing')}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white text-lg hover:bg-white/10 py-6"
                onClick={() => navigate('/pricing')}
              >
                Pricing
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white text-lg hover:bg-white/10 py-6"
              >
                Security
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white text-lg hover:bg-white/10 py-6"
              >
                Contact
              </Button>
            </nav>
            
            <div className="mt-12 space-y-4">
              <Button
                onClick={() => navigate('/auth')}
                variant="ghost"
                className="w-full text-white border border-white/20 hover:bg-white/10 py-6 text-lg"
              >
                Log In
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 py-6 text-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="text-xl font-bold">Vaultigo</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMenu(true)}
          className="text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 px-4 py-2 rounded-full mb-6">
            <span className="text-cyan-400">⚡</span>
            <span className="text-cyan-400 font-medium">Next-Generation Cloud Storage</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Secure, Smart,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lightning Fast
            </span>{' '}
            Cloud Storage
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Experience the future of cloud storage with AI-powered organization, military-grade security, 
            and seamless integration across all your devices.
          </p>

          <div className="space-y-4 mb-12">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Free →
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 py-4 text-lg rounded-xl"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Modern Teams
            </span>
          </h2>
          <p className="text-gray-300 mb-8">
            Everything you need to store, organize, and collaborate on your files with 
            enterprise-grade security and seamless integration across all your devices.
          </p>
          
          <Button
            onClick={() => navigate('/pricing')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            View Plans
          </Button>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Enter Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
