import { parseOrderDetails } from '@/utils/order';
import { format } from 'date-fns';
import { Bot } from 'lucide-react';
import { type ReactNode, useCallback } from 'react';
import { OrderPreview } from './Preview';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export const ChatMessages: IComponent<ChatMessagesProps> = ({ messages }) => (
  <div className='space-y-4'>
    {messages.map((message, index) =>
      message.role === 'assistant' ? (
        <BotMessage key={index} message={message} />
      ) : (
        <UserMessage key={index} message={message} />
      )
    )}
  </div>
);

const BotMessage: IComponent<{ message: ChatMessage }> = ({ message }) => {
  const renderWrapper = useCallback(
    (children: ReactNode) => (
      <div className='px-10 relative'>
        <span className='absolute top-0 left-0 font-semibold px-2 py-1 flex items-center gap-2 rounded-lg'>
          <Bot className='w-6 h-6 text-white' />
        </span>
        <div className='text-white min-w-[80%] pt-1'>{children}</div>
      </div>
    ),
    []
  );

  try {
    const orderDetails = parseOrderDetails(message.text);
    if (orderDetails) {
      return renderWrapper(<OrderPreview order={orderDetails} timestamp={message.created_at} />);
    }
  } catch (e) {}

  return renderWrapper(
    <div className='bg-purple4/40 rounded-2xl px-4 py-2 font-medium'>
      <p>{message.text}</p>
      <span className='text-xs opacity-70 mt-1 block'>{format(message.created_at * 1000, 'HH:mm')}</span>
    </div>
  );
};

export const UserMessage: IComponent<{ message: ChatMessage }> = ({ message }) => (
  <div className='flex justify-end'>
    <div className={'max-w-[80%] rounded-2xl px-4 py-2 font-medium bg-button text-gray-100'}>
      <p>{message.text}</p>
      <span className='text-xs opacity-70 mt-1 block'>{format(message.created_at * 1000, 'HH:mm')}</span>
    </div>
  </div>
);
