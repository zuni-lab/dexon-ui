import { Loader2 } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCall } from "wagmi";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ExampleCards } from "./ExampleCards";
import { WelcomeHeader } from "./WelcomeHeader";

interface ThreadDetailsProps {
  thread?: Partial<Thread>;
  messages: ChatMessage[];
  isLoading: boolean;
  typingMessage?: ChatMessage;
  newUserMessage?: ChatMessage;
  onSendMessage: (message: string) => Promise<void>;
}

export const ThreadDetails: IComponent<ThreadDetailsProps> = ({
  thread,
  messages,
  isLoading,
  typingMessage,
  newUserMessage,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    if (typingMessage || newUserMessage || messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [typingMessage, newUserMessage, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setInput("");
    await onSendMessage(input);
  };

  const handleExampleClick = useCallback((example: string) => {
    setInput(example);
  }, []);

  return (
    <div
      id="thread-details"
      className="scrollable flex h-full scroll-m-0 flex-col overflow-hidden"
    >
      <div className="mb-4 flex-1 overflow-y-auto p-4">
        {!thread && !typingMessage ? (
          <div className="space-y-6">
            <WelcomeHeader />
            <ExampleCards onExampleClick={handleExampleClick} />
          </div>
        ) : isLoading &&
          messages.length === 0 &&
          !!newUserMessage &&
          !!typingMessage ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple4" />
          </div>
        ) : (
          <>
            <ChatMessages
              messages={messages}
              typingMessage={typingMessage}
              newUserMessage={newUserMessage}
            />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput
        input={input}
        isLoading={isLoading}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
