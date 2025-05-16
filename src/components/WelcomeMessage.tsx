
import { Button } from "@/components/ui/button";

interface WelcomeMessageProps {
  onExampleClick: (message: string) => Promise<void>;
}

export function WelcomeMessage({ onExampleClick }: WelcomeMessageProps) {
  const examples = [
    "Hello! Can you help me learn Hmar?",
    "How do I say 'thank you' in Hmar?",
    "Can you translate 'My name is John' to Hmar?",
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <h2 className="text-3xl font-bold mb-3">Welcome to Bungpui AI</h2>
      <p className="text-chatapp-secondaryText mb-8 max-w-md">
        I'm your AI assistant designed to help you learn and explore the Hmar language.
        Ask me anything about translations, grammar, or Hmar culture!
      </p>
      
      <div className="grid gap-3 sm:grid-cols-3 w-full max-w-3xl">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="outline"
            className="border-chatapp-inputBorder bg-chatapp-userBubble text-left h-auto p-4"
            onClick={() => onExampleClick(example)}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  );
}
