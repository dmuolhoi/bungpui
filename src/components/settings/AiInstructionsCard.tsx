
import { useSettings } from "@/context/SettingsContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export const AiInstructionsCard = () => {
  const { settings, updateSettings } = useSettings();
  
  const handleInstructionChange = (value: string) => {
    updateSettings({ user_instruction: value });
    toast.success("Instructions updated");
  };
  
  return (
    <Card className="border-chatapp-inputBorder bg-chatapp-userBubble">
      <CardHeader>
        <CardTitle>AI Assistant Instructions</CardTitle>
        <CardDescription className="text-chatapp-secondaryText">
          Customize how the AI responds to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="instructions">Custom Instructions</Label>
          <Textarea
            id="instructions"
            placeholder="E.g. Explain concepts simply, focus on practical examples..."
            value={settings.user_instruction}
            onChange={(e) => handleInstructionChange(e.target.value)}
            className="min-h-[100px] bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text placeholder:text-chatapp-placeholder"
          />
          <p className="text-sm text-chatapp-secondaryText">
            These instructions will be included with every message to the AI
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
