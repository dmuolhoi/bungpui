
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
}
