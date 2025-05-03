import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import PricingPage from "@/pages/pricing";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import Footer from "./components/layouts/Footer";
import Header from "./components/layouts/Header";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  const [location] = useLocation();
  const showFooter = location !== "/auth";
  const showHeader = location !== "/auth" && !location.includes("/dashboard");
  
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route path="/pricing" component={PricingPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
