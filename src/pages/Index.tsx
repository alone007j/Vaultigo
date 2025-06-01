
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FilesSection } from "@/components/FilesSection";
import { UserProfile } from "@/components/UserProfile";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useAuth } from "@/hooks/useAuth";
import { useFileManagement } from "@/hooks/useFileManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState('files');
  const { user, signOut } = useAuth();
  const { files } = useFileManagement();

  const handleSignOut = async () => {
    await signOut();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'files':
        return <FilesSection />;
      case 'profile':
        return (
          <div className="max-w-md mx-auto">
            <UserProfile onClose={() => setActiveSection('files')} />
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-md mx-auto">
            <SettingsPanel onClose={() => setActiveSection('files')} />
          </div>
        );
      case 'pricing':
        return (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Choose Your Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white">Free</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-4">$0<span className="text-sm text-gray-400">/month</span></p>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li>• 1GB Storage</li>
                    <li>• Basic File Sharing</li>
                    <li>• Mobile Access</li>
                  </ul>
                  <Button className="w-full" variant="outline">Current Plan</Button>
                </div>
                
                <div className="p-6 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Pro</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-4">$9.99<span className="text-sm text-gray-400">/month</span></p>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li>• 100GB Storage</li>
                    <li>• Advanced Sharing</li>
                    <li>• Priority Support</li>
                    <li>• Version History</li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Upgrade Now</Button>
                </div>
                
                <div className="p-6 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <Crown className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Elite</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mb-4">$19.99<span className="text-sm text-gray-400">/month</span></p>
                  <ul className="space-y-2 text-gray-300 mb-6">
                    <li>• 1TB Storage</li>
                    <li>• Team Collaboration</li>
                    <li>• API Access</li>
                    <li>• Advanced Security</li>
                  </ul>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'contact':
        return (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-gray-300">
                <p className="mb-4">Need help? We're here for you!</p>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Email Support</h3>
                    <p className="text-sm text-gray-400">support@vaultigo.com</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-400">Available 24/7 for Pro and Elite users</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Documentation</h3>
                    <p className="text-sm text-gray-400">Check our comprehensive guides and FAQs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <FilesSection />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <AppSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          fileCount={files.length}
        />
        <SidebarInset className="flex-1">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {activeSection === 'files' && 'My Files'}
                  {activeSection === 'profile' && 'User Profile'}
                  {activeSection === 'settings' && 'Settings'}
                  {activeSection === 'pricing' && 'Pricing Plans'}
                  {activeSection === 'contact' && 'Contact Support'}
                </h1>
                <p className="text-gray-400">
                  Welcome back, {user?.email}
                </p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/20"
              >
                Sign Out
              </Button>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
