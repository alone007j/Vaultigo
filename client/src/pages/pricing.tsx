// Header and Footer are now managed by App.tsx
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Redirect } from "wouter";

interface PlanFeature {
  text: string;
  included: boolean;
  info?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string | null;
  period?: string;
  features: PlanFeature[];
  highlight?: boolean;
  buttonText: string;
}

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [redirect, setRedirect] = useState(false);

  const upgradeMutation = useMutation({
    mutationFn: async (plan: string) => {
      const res = await apiRequest("POST", "/api/upgrade-plan", { plan });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Plan updated",
        description: `Your plan has been updated to ${data.plan}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      setRedirect(true);
      return;
    }

    upgradeMutation.mutate(planId);
  };

  if (redirect) {
    return <Redirect to="/auth" />;
  }

  const plans: Plan[] = [
    {
      id: "free",
      name: "Starter Cloud",
      description: "Perfect for personal use",
      price: "Free",
      features: [
        { text: "10 GB Free Storage", included: true },
        { text: "Upload, Download, Organize files", included: true },
        { text: "Link 1 external storage account", included: true },
        { text: "Basic AI Assistant (Limited queries)", included: true },
        { text: "Standard upload/download speed", included: true },
        { text: "Occasional ads shown", included: true, info: "Non-intrusive ads to support our free tier" },
      ],
      buttonText: "Get Started Free",
    },
    {
      id: "pro",
      name: "Pro Cloud",
      description: "For professionals and small teams",
      price: "$9.99",
      period: "/month",
      highlight: true,
      features: [
        { text: "1 TB Storage", included: true },
        { text: "All Free Plan features", included: true },
        { text: "Link up to 3 external storage accounts", included: true },
        { text: "Advanced AI Assistant", included: true },
        { text: "Faster file upload and download speed", included: true },
        { text: "No ads — fully clean experience", included: true },
        { text: "File version history (30 days)", included: true },
      ],
      buttonText: "Upgrade to Pro",
    },
    {
      id: "elite",
      name: "Elite Cloud",
      description: "Maximum power and security",
      price: "$24.99",
      period: "/month",
      features: [
        { text: "5 TB Storage", included: true },
        { text: "Everything in Pro Cloud", included: true },
        { text: "Link unlimited external storage accounts", included: true },
        { text: "Full AI Assistant access with choice of AI model", included: true },
        { text: "Password-protected links and expiration settings", included: true },
        { text: "Enhanced security with extended 2FA options", included: true },
        { text: "180-Day file version history", included: true },
        { text: "VIP Priority Support 24/7", included: true },
      ],
      buttonText: "Upgrade to Elite",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="font-poppins font-bold text-3xl md:text-4xl text-foreground mb-4">
                Simple pricing for <span className="text-accent-cyan">every need</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Choose the perfect plan for your storage requirements, with flexible options and powerful features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`card-lift bg-primary-900/60 backdrop-blur-sm rounded-2xl p-6 border relative ${
                    plan.highlight
                      ? "border-accent-blue/30 shadow-lg shadow-accent-blue/10"
                      : "border-muted/30"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-blue text-white text-xs font-medium py-1 px-4 rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="font-poppins font-semibold text-2xl text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                    <div className="mt-5 flex items-end">
                      <span className="text-foreground font-poppins font-bold text-4xl">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground ml-1 mb-1">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        {feature.included ? (
                          <Check className="text-accent-cyan mt-1 mr-2 h-4 w-4 shrink-0" />
                        ) : (
                          <Info className="text-muted-foreground/60 mt-1 mr-2 h-4 w-4 shrink-0" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-muted-foreground"
                              : "text-muted-foreground/60"
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={user?.plan === plan.id || upgradeMutation.isPending}
                    className={`ripple w-full ${
                      plan.highlight
                        ? "hover-glow bg-accent-blue text-white"
                        : "border border-muted/30 text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {user?.plan === plan.id ? "Current Plan" : plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                All plans include a 14-day free trial. No credit card required.
              </p>
              <a
                href="#"
                className="text-accent-cyan hover:text-accent-blue underline transition-colors"
              >
                View complete comparison →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
