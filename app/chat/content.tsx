'use client';

import { chatService } from '@/api/chat';
import { useCallback, useState } from 'react';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';

export const MainContent = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await chatService.sendMessage({
        message: input,
        threadId: threadId || undefined
      });

      let currentMessage = '';
      setMessages((prev) => [...prev, { text: '▊', isUser: false }]);

      // Split the response text into lines and process each event
      const lines = response.data.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Handle event type
        if (line.startsWith('event: ')) {
          const eventType = line.slice(7);
          // Get corresponding data line
          const dataLine = lines[i + 1];
          if (dataLine?.startsWith('data: ')) {
            const data = dataLine.slice(6);

            switch (eventType) {
              case 'thread':
                try {
                  const threadData = JSON.parse(data);
                  setThreadId(threadData.thread_id);
                  if (threadData.thread_id) {
                    window.history.pushState({}, '', `/chat/${threadData.thread_id}`);
                  }
                } catch (e) {}
                break;

              case 'message':
                await new Promise((resolve) => setTimeout(resolve, 50)); // Delay for typing effect
                currentMessage += data;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].text = `${currentMessage}▊`;
                  return newMessages;
                });
                break;

              case 'done':
                try {
                  const statusData = JSON.parse(data);
                  if (statusData.status === 'completed') {
                    setIsLoading(false);
                  }
                } catch (e) {}
                break;
            }
          }
          // Skip the data line since we've already processed it
          i++;
        }
      }

      // Remove cursor from final message
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = currentMessage;
        return newMessages;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Error: Failed to get response',
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleParseOrder = useCallback(async (order: OrderDetails) => {}, []);

  return (
    <div className='flex-1 flex flex-col'>
      <ChatArea messages={messages} isLoading={isLoading} onParseOrder={handleParseOrder} />
      <InputArea input={input} setInput={setInput} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
