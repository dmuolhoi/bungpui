
import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMessages, messagesToJson } from '@/hooks/useMessages';
import { Message, ChatContextType } from '@/types/chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { user, session } = useAuth();
  const { settings } = useSettings();
  const { messages, setMessages } = useMessages(user?.id);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Call the Supabase Edge Function to get the AI response
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: content },
        headers: session ? {
          Authorization: `Bearer ${session.access_token}`
        } : undefined
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || 'Error calling AI service');
      }
      
      // Add AI response
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // If user is logged in, sync to Supabase
      if (user) {
        await syncMessagesToSupabase(finalMessages, user.id);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const syncMessagesToSupabase = async (msgs: Message[], userId: string) => {
    try {
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existingConversation) {
        // Update existing conversation
        await supabase
          .from('conversations')
          .update({ 
            messages: messagesToJson(msgs),
            timestamp: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new conversation
        await supabase
          .from('conversations')
          .insert({ 
            user_id: userId, 
            messages: messagesToJson(msgs),
            timestamp: new Date().toISOString()
          });
      }
    } catch (err) {
      console.error('Failed to sync conversation to Supabase:', err);
      // Don't throw here, just log the error - messages are still in localStorage
    }
  };

  const clearChat = async () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    
    // If user is logged in, also clear in Supabase
    if (user) {
      try {
        await supabase
          .from('conversations')
          .update({ 
            messages: [],
            timestamp: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Failed to clear conversation in Supabase:', err);
        // Don't throw, just log the error
      }
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearChat, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export { type Message } from '@/types/chat';
