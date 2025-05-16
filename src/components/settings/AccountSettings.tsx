
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const AccountSettings = () => {
  const { logout } = useAuth();
  const { clearChat } = useChat();
  const navigate = useNavigate();
  
  const handleClearChat = () => {
    clearChat();
    toast.success("Chat history cleared");
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };
  
  return (
    <Card className="border-chatapp-inputBorder bg-chatapp-userBubble">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription className="text-chatapp-secondaryText">
          Manage your account and data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline"
              className="w-full border-chatapp-inputBorder hover:bg-red-900 hover:text-white"
            >
              Clear Chat History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-chatapp-aiBubble border-chatapp-inputBorder">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
              <AlertDialogDescription className="text-chatapp-secondaryText">
                This will permanently delete all your conversation history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-chatapp-inputBg text-chatapp-text border-chatapp-inputBorder hover:bg-chatapp-userBubble">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearChat}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-chatapp-inputBorder hover:bg-red-900 hover:text-white"
            >
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-chatapp-aiBubble border-chatapp-inputBorder">
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription className="text-chatapp-secondaryText">
                You will be redirected to the login screen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-chatapp-inputBg text-chatapp-text border-chatapp-inputBorder hover:bg-chatapp-userBubble">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleLogout}
                className="bg-white text-black hover:bg-black hover:text-white"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
