
import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      await onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (but not with Shift+Enter for newlines)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:relative"
    >
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] w-full resize-none rounded-md border-chatapp-inputBorder bg-chatapp-inputBg text-chatapp-text placeholder:text-chatapp-placeholder focus:outline-none focus:ring-1 focus:ring-chatapp-inputBorder"
          disabled={isLoading}
        />
        <Button
          className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white text-black hover:bg-chatapp-userBubble hover:text-white"
          size="icon"
          type="submit"
          disabled={isLoading || !message.trim()}
          title="Send message"
        >
          {isLoading ? (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}
