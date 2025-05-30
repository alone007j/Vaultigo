
import { useState } from 'react';
import { Check, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      name: 'Starter Cloud',
      subtitle: 'Perfect for personal use',
      price: 'Free',
      period: '',
      icon: '⚡',
      color: 'from-gray-600 to-gray-700',
      popular: true,
      features: [
        '10 GB Free Storage',
        'Upload, Download, Organize files',
        'Link 1 external storage (Dropbox or Terabox)',
        'Basic AI Assistant (Limited queries)',
        'Standard upload/download speed',
        'Theme switching available',
        'Community support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Cloud',
      subtitle: 'Best for professionals',
      price: '$9.99',
      period: '/month',
      icon: '🚀',
      color: 'from-blue-600 to-cyan-500',
      popular: false,
      features: [
        '1 TB Storage',
        'All Free Plan features',
        'Link up to 3 external storage accounts',
        'Advanced AI Assistant (unlimited basic queries)',
        'No ads — fully clean experience',
        'Faster file upload and download speed',
        'File version history (30 days)',
        'Dashboard theme customization',
        'Priority support',
      ],
    },
    {
      id: 'elite',
      name: 'Elite Cloud',
      subtitle: 'For teams and enterprises',
      price: '$29.99',
      period: '/month',
      icon: '👑',
      color: 'from-purple-600 to-pink-500',
      popular: false,
      features: [
        '5 TB Storage',
        'Everything in Pro Cloud',
        'Link unlimited external storage accounts',
        'Full AI Assistant access (OpenAI, Gemini, Grok, xAI)',
        'AI auto-organize, summarize, and search files',
        'Personal AI customization',
        'Password-protected sharing links',
        'Enhanced Security & 2FA options',
        'File encryption settings',
        '180-Day File Version History',
        'VIP Priority Support 24/7',
      ],
    },
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Military-Grade Security',
      description: 'End-to-end encryption, 2FA, and advanced security protocols protect your data.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Organization',
      description: 'Smart file organization, auto-tagging, and intelligent search powered by AI.',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast Sync',
      description: 'Ultra-fast upload and download speeds with global CDN infrastructure.',
    },
    {
      icon: '🔗',
      title: 'External Storage Integration',
      description: 'Seamlessly integrate with your existing cloud storage providers.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="text-xl font-bold">Vaultigo</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 px-4 py-2 rounded-full mb-6">
            <span className="text-cyan-400">⚡</span>
            <span className="text-cyan-400 font-medium">Next-Generation Cloud Storage</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Secure, Smart,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Lightning Fast
            </span>{' '}
            Cloud Storage
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Experience the future of cloud storage with AI-powered organization, military-grade security, 
            and seamless integration across all your devices.
          </p>

          <div className="flex justify-center space-x-4 mb-8">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-3 rounded-xl">
              Get Started Free →
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-xl">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Choose Your Plan */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-gray-300">
            Start free and scale as you grow. All plans include our core security features and 30-day money-back guarantee.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/20'
                  : 'border-white/20'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-1">
                  Most Popular
                </Badge>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {plan.price}
                    <span className="text-sm text-gray-400">{plan.period}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
                  plan.id === 'pro'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:scale-105'
                    : plan.id === 'elite'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 hover:scale-105'
                    : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                }`}
              >
                {plan.id === 'starter' ? 'Get Started Free' : `Start ${plan.name} Trial`}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 flex justify-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="text-cyan-400 hover:bg-cyan-400/10"
          >
            Log In
          </Button>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-3 rounded-xl"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
