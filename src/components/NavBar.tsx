
import { useAuth } from "@/context/AuthContext";
import { Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnChat = location.pathname === "/chat";
  const isOnSettings = location.pathname === "/settings";

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-chatapp-inputBorder bg-chatapp-background py-3">
      <div className="container flex items-center justify-between">
        <h1 className="text-xl font-bold">Bungpui AI</h1>
        
        {user && (
          <div className="flex items-center space-x-2">
            <span className="hidden text-sm text-chatapp-secondaryText md:inline-block">
              {user.email}
            </span>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNavigation('/settings')}
              className={`hover:bg-chatapp-userBubble dark:hover:bg-opacity-50 ${isOnSettings ? 'bg-chatapp-userBubble/30' : ''}`}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNavigation('/chat')}
              className={`hover:bg-chatapp-userBubble dark:hover:bg-opacity-50 ${isOnChat ? 'bg-chatapp-userBubble/30' : ''}`}
            >
              <span className="sr-only">Chat</span>
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
