
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Shield, Cloud, Zap, Users, Menu, X, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      title: "Military-Grade Security",
      description: "End-to-end encryption with advanced security protocols to protect your valuable data."
    },
    {
      icon: <Cloud className="h-8 w-8 text-cyan-400" />,
      title: "Smart Cloud Storage",
      description: "AI-powered organization and intelligent file management across all your devices."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Lightning Fast Sync",
      description: "Ultra-fast upload and download speeds with global CDN infrastructure."
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: "Team Collaboration",
      description: "Seamless sharing and collaboration tools for teams of any size."
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["10 GB Storage", "Basic Security", "Mobile Apps", "Email Support"]
    },
    {
      name: "Pro",
      price: "$9.99",
      features: ["1 TB Storage", "Advanced Security", "Priority Support", "Team Features"]
    },
    {
      name: "Elite",
      price: "$29.99",
      features: ["5 TB Storage", "Enterprise Security", "24/7 Support", "Custom Integration"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="relative z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <Button
              onClick={() => navigate('/auth')}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-xl"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 md:hidden">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Button
                onClick={() => navigate('/auth')}
                variant="ghost"
                className="w-full text-left justify-start text-gray-300 hover:text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full mb-8">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Next-Generation Cloud Storage</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure, Smart,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Lightning Fast
            </span>{' '}
            Cloud Storage
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the future of file storage with AI-powered organization, military-grade security, 
            and seamless sync across all your devices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 rounded-xl text-lg"
            >
              Watch Demo
            </Button>
          </div>

          <div className="text-gray-400">
            <p>✓ 10GB Free Storage • ✓ No Credit Card Required • ✓ Setup in 2 Minutes</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Vaultigo?
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Built for the modern world with cutting-edge technology and user-centric design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-gray-300 text-lg">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 ${index === 1 ? 'border-2 border-blue-500 scale-105' : 'border border-gray-700'}`}>
                {index === 1 && (
                  <div className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-6">
                  {plan.price}
                  <span className="text-lg text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate('/pricing')}
                  className={`w-full ${index === 1 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600' : 'bg-gray-700 hover:bg-gray-600'} text-white py-3 rounded-xl`}
                >
                  {index === 0 ? 'Get Started' : 'Start Free Trial'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Digital Life?
            </span>
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of users who trust Vaultigo with their most important files.
          </p>
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Logo size="sm" className="justify-center mb-4" />
          <p className="text-gray-400">© 2024 Vaultigo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
