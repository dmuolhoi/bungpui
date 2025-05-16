import { useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { MessageItem } from "@/components/MessageItem";
import { MessageInput } from "@/components/MessageInput";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { NavBar } from "@/components/NavBar";
import { VersionInfo } from "@/components/VersionInfo";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

const Chat = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const { user } = useAuth();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Simple scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current && messages.length > 0) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle sending message (returns Promise<void>)
  const handleSendMessage = async (message: string): Promise<void> => {
    if (message.trim()) {
      await sendMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-chatapp-background to-chatapp-background/95 overflow-hidden">
      <NavBar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Fixed-height scrollable message container that keeps content at the bottom */}
        <div 
          ref={messageContainerRef}
          className="flex-1 flex flex-col overflow-y-auto py-4 px-2 md:px-4 safe-area-inset-top"
        >
          <div className={`container mx-auto ${isMobile ? "px-2" : "max-w-4xl px-4"}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center fade-in">
                <WelcomeMessage onExampleClick={handleSendMessage} />
                <div className="flex justify-center mt-6">
                  <VersionInfo showLabel className="opacity-70" />
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-2">
                {messages.map((message) => (
                  <MessageItem key={message.id} message={message} />
                ))}
                
                {/* Loading indicator when waiting for AI response */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="text-chatapp-secondaryText px-4 py-3 rounded-lg bg-chatapp-aiBubble/30 backdrop-blur-sm max-w-[90%] md:max-w-[75%] scale-in">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-chatapp-secondaryText animate-pulse"></div>
                        <div className="h-2 w-2 rounded-full bg-chatapp-secondaryText animate-pulse delay-150"></div>
                        <div className="h-2 w-2 rounded-full bg-chatapp-secondaryText animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          
        <div className="sticky bottom-0 py-4 px-2 md:px-4 bg-gradient-to-t from-chatapp-background via-chatapp-background to-transparent safe-area-inset-bottom">
          <div className={`container mx-auto ${isMobile ? "px-2" : "max-w-4xl px-4"}`}>
            <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
