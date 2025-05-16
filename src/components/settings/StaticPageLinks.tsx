
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const StaticPageLinks = () => {
  return (
    <Card className="border-chatapp-inputBorder bg-chatapp-userBubble">
      <CardHeader>
        <CardTitle>About & Legal</CardTitle>
        <CardDescription className="text-chatapp-secondaryText">
          Important information about our service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline"
          asChild
          className="w-full border-chatapp-inputBorder hover:bg-chatapp-aiBubble hover:text-white"
        >
          <Link to="/about">About Us</Link>
        </Button>
        
        <Button 
          variant="outline"
          asChild
          className="w-full border-chatapp-inputBorder hover:bg-chatapp-aiBubble hover:text-white"
        >
          <Link to="/terms">Terms of Service</Link>
        </Button>
        
        <Button 
          variant="outline"
          asChild
          className="w-full border-chatapp-inputBorder hover:bg-chatapp-aiBubble hover:text-white"
        >
          <Link to="/privacy">Privacy Policy</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
