
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Helper function to convert Message[] to Json-compatible format
export const messagesToJson = (msgs: Message[]): Json => {
  return msgs.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp.toISOString()
  })) as Json;
};

export const useMessages = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from Supabase or localStorage when user changes
  useEffect(() => {
    const loadMessages = async () => {
      if (userId) {
        // Try to load conversations from Supabase first
        try {
          const { data, error } = await supabase
            .from('conversations')
            .select('messages')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching conversations:', error);
            throw error;
          }
          
          if (data && data.messages) {
            // Parse stored messages and convert string timestamps back to Date objects
            const parsedMessages = (data.messages as any[]).map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(parsedMessages);
            return;
          }
        } catch (err) {
          console.error('Failed to load conversations from Supabase:', err);
          // Continue to try localStorage as fallback
        }
        
        // Fallback to localStorage if Supabase fails or returns no data
        const storedMessages = localStorage.getItem('chatHistory');
        if (storedMessages) {
          // Parse stored messages and convert string timestamps back to Date objects
          const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } else {
          setMessages([]);
        }
      } else {
        // User not logged in, clear messages
        setMessages([]);
      }
    };

    loadMessages();
  }, [userId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  return {
    messages,
    setMessages
  };
};
