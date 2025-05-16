
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
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
            <h2 className="text-2xl font-bold">About Us</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-chatapp-text">
              Welcome to our platform dedicated to language preservation and cultural heritage.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">Our Mission</h3>
            <p className="text-chatapp-text">
              Our mission is to provide an accessible platform for preserving and promoting
              lesser-known languages, with a special focus on Hmar and other languages of 
              Northeast India. We believe that language is a crucial part of cultural identity,
              and we're committed to creating tools that help communities maintain their
              linguistic heritage.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">What We Do</h3>
            <p className="text-chatapp-text">
              Our platform leverages artificial intelligence to facilitate language learning,
              documentation, and translation. We work closely with native speakers and
              linguistic experts to ensure the accuracy and cultural sensitivity of our
              language resources.
            </p>
            
            <h3 className="mt-6 text-xl font-semibold text-black">Contact Us</h3>
            <p className="text-chatapp-text">
              If you have any questions or would like to contribute to our project,
              please don't hesitate to reach out to us at dmuolhoi@gmail.com.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
