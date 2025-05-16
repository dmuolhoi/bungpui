
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChatSettings } from "@/components/settings/ChatSettings";
import { AiInstructionsCard } from "@/components/settings/AiInstructionsCard";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { UserProfile } from "@/components/settings/UserProfile";
import { StaticPageLinks } from "@/components/settings/StaticPageLinks";
import { VersionInfo, APP_VERSION } from "@/components/VersionInfo";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

// Define the available tabs
type SettingsTab = "chat" | "profile" | "account";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("chat");
  const { user } = useAuth();
  
  const handleBackToChat = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/chat');
  };
  
  return (
    <div className="flex flex-col h-screen w-full bg-chatapp-background overflow-hidden">
      <NavBar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="py-6 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <VersionInfo showLabel={true} className="opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)}>
              <div className="overflow-x-auto -mx-4 px-4">
                <TabsList className="mb-6 bg-chatapp-inputBg w-full justify-start">
                  <TabsTrigger value="chat">Chat Settings</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat" className="space-y-6">
                <ChatSettings />
                <AiInstructionsCard />
                <Card className="border-chatapp-inputBorder bg-chatapp-aiBubble/60">
                  <CardContent className="pt-6">
                    <CardDescription className="text-chatapp-secondaryText">
                      This is a pre-alpha version ({APP_VERSION}) of the application. Features may change and some functionality might not be fully implemented yet.
                    </CardDescription>
                  </CardContent>
                </Card>
                <StaticPageLinks />
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-6">
                <UserProfile />
              </TabsContent>
              
              <TabsContent value="account" className="space-y-6">
                <AccountSettings />
                <StaticPageLinks />
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleBackToChat}
                className="bg-white text-black hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-xl"
              >
                Back to Chat
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
