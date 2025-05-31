
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const { toast } = useToast();

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 'Free',
      period: '',
      icon: '⚡',
      color: 'from-gray-600 to-gray-700',
      features: [
        '10 GB Storage',
        'Basic file management',
        'Standard upload speed',
        'Community support'
      ],
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$9.99',
      period: '/month',
      icon: '🚀',
      color: 'from-blue-600 to-cyan-500',
      popular: true,
      features: [
        '1 TB Storage',
        'Advanced AI features',
        'Fast upload/download',
        'Priority support'
      ],
    },
    {
      id: 'elite',
      name: 'Elite Plan',
      price: '$19.99',
      period: '/month',
      icon: '👑',
      color: 'from-purple-600 to-pink-500',
      features: [
        '5 TB Storage',
        'Full AI Assistant',
        'Enhanced security',
        'VIP support 24/7'
      ],
    },
  ];

  const handlePlanSelection = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    
    if (planId === 'free') {
      toast({
        title: "Welcome to Vaultigo!",
        description: "You're all set with the Free plan. Enjoy exploring!",
      });
      onClose();
    } else {
      toast({
        title: "Plan Selected",
        description: `You've selected the ${plan?.name}. This would redirect to payment.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 border-gray-700 text-white max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            <div className="flex flex-col items-center space-y-4 mb-4">
              <Logo size="lg" />
              <div>
                <h2 className="text-2xl font-bold">Welcome to Vaultigo!</h2>
                <p className="text-gray-300 text-sm mt-2">Choose your perfect plan to get started</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-pointer hover:border-cyan-400 transition-all duration-300`}
              onClick={() => handlePlanSelection(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-3 py-1">
                  Most Popular
                </Badge>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center text-lg`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="font-bold">{plan.name}</h3>
                    <div className="text-lg font-bold">
                      {plan.price}
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelection(plan.id);
                }}
                className={`w-full h-10 rounded-lg font-semibold transition-all duration-300 ${
                  plan.id === 'pro'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                    : plan.id === 'elite'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {plan.id === 'free' ? 'Start Free' : `Choose ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full mt-4 text-gray-400 hover:text-white"
        >
          Skip for now
        </Button>
      </DialogContent>
    </Dialog>
  );
};
