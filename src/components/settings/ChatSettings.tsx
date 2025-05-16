
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export const ChatSettings = () => {
  const { settings, updateSettings, isLoading } = useSettings();
  
  const handleLanguageChange = (value: string) => {
    updateSettings({ preferred_language: value });
    toast.success("Language preference updated");
  };
  
  const handleCodeblocksToggle = (checked: boolean) => {
    updateSettings({ show_codeblocks: checked });
    toast.success(checked ? "Code blocks enabled" : "Code blocks disabled");
  };
  
  const handleContextWindowChange = (value: number[]) => {
    updateSettings({ context_window: value[0] });
    toast.success(`Context window set to ${value[0]} messages`);
  };
  
  return (
    <Card className="border-chatapp-inputBorder bg-chatapp-userBubble">
      <CardHeader>
        <CardTitle>Chat Settings</CardTitle>
        <CardDescription className="text-chatapp-secondaryText">
          Configure how the chat interface behaves
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language</Label>
          <Select 
            value={settings.preferred_language} 
            onValueChange={handleLanguageChange}
            disabled={isLoading}
          >
            <SelectTrigger 
              id="language" 
              className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hmar">Hmar</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-chatapp-secondaryText">
            Your preferred language for interactions
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="context_window">Context Window: {settings.context_window} messages</Label>
          <Slider 
            id="context_window" 
            defaultValue={[settings.context_window]}
            min={1}
            max={10}
            step={1}
            onValueChange={handleContextWindowChange}
            disabled={isLoading}
          />
          <p className="text-sm text-chatapp-secondaryText">
            Number of previous messages to include for context
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="codeblocks">Show Codeblocks</Label>
            <p className="text-sm text-chatapp-secondaryText">
              Enable markdown and code formatting
            </p>
          </div>
          <Switch
            id="codeblocks"
            checked={settings.show_codeblocks}
            onCheckedChange={handleCodeblocksToggle}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
