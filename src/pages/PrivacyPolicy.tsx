
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
            <h2 className="text-2xl font-bold">Privacy Policy</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-chatapp-text">
              Last updated: May 8, 2024
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">1. Information We Collect</h3>
            <p className="text-chatapp-text">
              We collect information you provide directly to us when you create an account,
              including your name, email address, and profile information. We also collect
              data about your interactions with our service.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">2. How We Use Your Information</h3>
            <p className="text-chatapp-text">
              We use the information we collect to provide, maintain, and improve our services,
              to process and complete transactions, and to communicate with you.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">3. Information Sharing</h3>
            <p className="text-chatapp-text">
              We do not share your personal information with third parties except as described in
              this privacy policy. We may share information with service providers who perform services
              on our behalf.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">4. Data Security</h3>
            <p className="text-chatapp-text">
              We take reasonable measures to help protect information about you from loss, theft,
              misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">5. Your Rights</h3>
            <p className="text-chatapp-text">
              You can access and update certain information about yourself from your account settings.
              You can also request deletion of your account by contacting us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
