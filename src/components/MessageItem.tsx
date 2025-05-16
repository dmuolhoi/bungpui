
import { Message } from "@/context/ChatContext";
import { useSettings } from "@/context/SettingsContext";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useRef } from "react";
import remarkGfm from "remark-gfm";
import { Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { settings } = useSettings();
  const { toast } = useToast();
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [displayedContent, setDisplayedContent] = useState(isUser ? message.content : "");
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get typing state from localStorage
  useEffect(() => {
    if (isUser) return;
    
    const typingCompletedMessages = JSON.parse(localStorage.getItem('typingCompletedMessages') || '[]');
    const isMessageTyped = typingCompletedMessages.includes(message.id);
    
    if (isMessageTyped) {
      // If already typed before, show full content immediately
      setDisplayedContent(message.content);
      setIsTyping(false);
    } else {
      // If new message, start typing effect
      setIsTyping(true);
      let i = 0;
      const typingSpeed = 15; // milliseconds per character
      const content = message.content;
      
      const typingInterval = setInterval(() => {
        if (i < content.length) {
          setDisplayedContent(content.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Save to localStorage that typing is completed for this message
          const updatedCompletedMessages = [...typingCompletedMessages, message.id];
          localStorage.setItem('typingCompletedMessages', JSON.stringify(updatedCompletedMessages));
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    }
  }, [message.id, message.content, isUser]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        duration: 2000,
      });
      
      // Reset the copied state after animation completes
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[90%] md:max-w-[75%] px-4 py-3 transition-all duration-200 rounded-lg",
          isUser
            ? "bg-chatapp-userBubble text-chatapp-text text-right shadow-md"
            : "bg-gradient-to-br from-chatapp-aiBubble to-chatapp-aiBubble/80 text-chatapp-text text-left shadow-sm backdrop-blur-sm"
        )}
        ref={contentRef}
      >
        {isUser || !settings.show_codeblocks ? (
          <div className={cn("whitespace-pre-wrap break-words", !isUser && "text-left mobile-text-wrap")}>
            {message.content}
          </div>
        ) : (
          <ScrollArea className="max-h-[80vh]">
            <div 
              className="markdown break-words text-left mobile-text-wrap"
              style={{ 
                minWidth: "300px", 
                width: "100%", 
                overflowWrap: "break-word", 
                wordWrap: "break-word",
                wordBreak: "break-word",
                hyphens: "auto"
              }}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Improved table rendering
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="border-collapse w-full" {...props} />
                    </div>
                  ),
                  thead: props => <thead className="bg-chatapp-codeBlock" {...props} />,
                  th: props => <th className="border border-chatapp-inputBorder p-2 text-left" {...props} />,
                  td: props => <td className="border border-chatapp-inputBorder p-2" {...props} />,
                  
                  // Better code block rendering with improved text wrapping
                  code: ({node, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return (
                      <div className="relative my-4">
                        <pre className={cn(
                          "bg-chatapp-codeBlock p-4 rounded-md overflow-x-auto",
                          "border border-chatapp-inputBorder"
                        )}>
                          <code className={cn(className, "font-mono text-chatapp-codeText whitespace-pre-wrap break-words")} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                  
                  // Ensure paragraphs have proper text alignment and wrapping
                  p: ({children, ...props}) => (
                    <p 
                      className="text-left mb-3" 
                      style={{ 
                        width: "100%", 
                        overflowWrap: "break-word", 
                        wordWrap: "break-word", 
                        wordBreak: "break-word",
                        hyphens: "auto", 
                        paddingRight: "4px" // Add slight padding to prevent text from touching edge
                      }} 
                      {...props}
                    >
                      {children}
                    </p>
                  ),
                }}
              >
                {isTyping ? displayedContent : message.content}
              </ReactMarkdown>
              {isTyping && (
                <span className="animate-pulse inline-block ml-1">▌</span>
              )}
            </div>
          </ScrollArea>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-chatapp-secondaryText">
            {timestamp}
          </span>
          
          {/* Copy button for AI messages only */}
          {!isUser && (
            <button 
              onClick={handleCopy}
              className={cn(
                "text-chatapp-secondaryText hover:text-chatapp-text transition-colors duration-200 p-1 rounded-full hover:bg-black hover:bg-opacity-10",
                isCopied ? "copy-success text-green-400" : ""
              )}
              aria-label="Copy message"
            >
              {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
