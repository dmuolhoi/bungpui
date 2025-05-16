
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle 
          aria-label="Toggle theme" 
          variant="outline"
          onClick={toggleTheme}
          className="bg-transparent border-0 hover:bg-chatapp-userBubble dark:hover:bg-opacity-50"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</p>
      </TooltipContent>
    </Tooltip>
  );
}
