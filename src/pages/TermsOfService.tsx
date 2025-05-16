
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex h-screen flex-col bg-chatapp-background">
      <NavBar />
      
      <main className="flex-1 overflow-y-auto py-6">
        <div className="container">
          <div className="mb-8 flex items-center">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="mr-4 border-chatapp-inputBorder hover:bg-chatapp-aiBubble hover:text-white"
            >
              Back
            </Button>
            <h2 className="text-2xl font-bold">Terms of Service</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-chatapp-text">
              Last updated: May 8, 2024
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">1. Acceptance of Terms</h3>
            <p className="text-chatapp-text">
              By accessing or using our service, you agree to be bound by these Terms. 
              If you disagree with any part of the terms, you may not access the service.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">2. Use License</h3>
            <p className="text-chatapp-text">
              Permission is granted to temporarily use the platform for personal, non-commercial
              purposes only. This is the grant of a license, not a transfer of title.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">3. User Accounts</h3>
            <p className="text-chatapp-text">
              When you create an account with us, you must provide information that is accurate,
              complete, and current at all times. Failure to do so constitutes a breach of the Terms.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">4. Content</h3>
            <p className="text-chatapp-text">
              Our service allows you to post, link, store, share and otherwise make available certain
              information, text, or material. You are responsible for the content you post.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">5. Changes to Terms</h3>
            <p className="text-chatapp-text">
              We reserve the right to modify or replace these Terms at any time. If a revision is
              material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
