import type React from 'react';
import { useState } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import { ExampleCards } from './components/ExampleCards';
import { WelcomeHeader } from './components/WelcomeHeader';

interface ThreadDetailsProps {
  thread: Thread | null;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export const ThreadDetails: IComponent<ThreadDetailsProps> = ({
  thread,
  messages,
  isLoading,
  onSendMessage
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await onSendMessage(input);
    setInput('');
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4'>
        {!thread ? (
          <div className='space-y-4'>
            <WelcomeHeader />
            <ExampleCards onExampleClick={handleExampleClick} />
          </div>
        ) : (
          <ChatMessages messages={messages} />
        )}
      </div>

      <ChatInput input={input} isLoading={isLoading} onChange={setInput} onSubmit={handleSubmit} />
    </div>
  );
};
