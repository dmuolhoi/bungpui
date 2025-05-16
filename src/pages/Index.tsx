
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VersionInfo } from "@/components/VersionInfo";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Only redirect once after auth state is confirmed
  useEffect(() => {
    if (!loading) {
      // Use a simple redirect without extra state management
      navigate(user ? "/chat" : "/login", { replace: true });
    }
  }, [navigate, user, loading]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-chatapp-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent mb-6"></div>
      <VersionInfo showLabel className="mt-4" />
    </div>
  );
};

export default Index;
