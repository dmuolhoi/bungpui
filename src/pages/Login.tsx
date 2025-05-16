
import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VersionInfo } from "@/components/VersionInfo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, loading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Clear error when switching modes or when inputs change
  useEffect(() => {
    setAuthError(null);
  }, [isLogin, email, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setAuthError(null);
    
    try {
      if (isLogin) {
        await login(email, password);
        navigate("/chat");
        toast.success("Login successful");
      } else {
        await signup(email, password);
        toast.success("Account created successfully. Check your email for verification link.");
        // Don't navigate on signup as email confirmation may be required
      }
    } catch (error: any) {
      console.error(error);
      
      // Handle specific error cases
      if (error.message?.includes("Email not confirmed")) {
        setAuthError("Please check your email and click the confirmation link before logging in.");
        
        // Offer to resend confirmation email
        toast.error("Email not confirmed", {
          description: "Check your inbox for the verification email",
          action: {
            label: "Resend Email",
            onClick: async () => {
              try {
                const { error: resendError } = await supabase.auth.resend({
                  type: 'signup',
                  email: email,
                });
                
                if (resendError) throw resendError;
                toast.success("Verification email resent! Please check your inbox.");
              } catch (err) {
                toast.error("Failed to resend verification email");
              }
            }
          }
        });
      } else if (error.message?.includes("Invalid login credentials")) {
        setAuthError("Invalid email or password. Please try again.");
      } else {
        setAuthError(error.message || "Authentication error. Please try again.");
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setAuthError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-chatapp-background p-4">
      <Card className="w-full max-w-md border-chatapp-inputBorder bg-chatapp-aiBubble">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Bungpui AI</CardTitle>
          <CardDescription className="text-center text-chatapp-secondaryText">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {authError && (
              <div className="p-3 rounded bg-red-900/20 border border-red-800 text-red-200 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-medium text-chatapp-text"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text placeholder:text-chatapp-placeholder"
                required
              />
            </div>
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-medium text-chatapp-text"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text placeholder:text-chatapp-placeholder"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-black hover:text-white transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="link" 
            className="w-full text-chatapp-text hover:text-chatapp-secondaryText"
            onClick={toggleMode}
          >
            {isLogin 
              ? "Don't have an account? Create one" 
              : "Already have an account? Sign in"}
          </Button>
          
          {isLogin && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-chatapp-secondaryText hover:text-chatapp-text"
              onClick={async () => {
                try {
                  const email = prompt("Enter your email to reset your password:");
                  if (!email) return;
                  
                  const { error } = await supabase.auth.resetPasswordForEmail(email);
                  
                  if (error) throw error;
                  toast.success("Password reset email sent! Check your inbox.");
                } catch (err) {
                  toast.error("Failed to send password reset email");
                }
              }}
            >
              Forgot password?
            </Button>
          )}
          
          <VersionInfo className="mt-4 text-center w-full opacity-70" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
