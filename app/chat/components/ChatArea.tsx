import { parseOrderDetails } from '@/utils/order';
import Image from 'next/image';
import { useEffect } from 'react';
import { OrderBox } from './OrderBox';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatMessageProps {
  message: Message;
  onParseOrder: (order: OrderDetails) => void;
}

interface ChatAreaProps {
  messages: Array<Message>;
  isLoading: boolean;
  onParseOrder: (order: OrderDetails) => void;
}

export const ChatMessage: IComponent<ChatMessageProps> = ({ message, onParseOrder }) => {
  const orderDetails = !message.isUser ? parseOrderDetails(message.text) : null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: JSON.stringify is used to compare deep equality
  useEffect(() => {
    if (orderDetails) {
      onParseOrder(orderDetails);
    }
  }, [JSON.stringify(orderDetails), onParseOrder]);

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] ${
          message.isUser
            ? 'bg-indigo-600 text-white p-4 rounded-lg'
            : orderDetails
              ? 'w-full max-w-md'
              : 'bg-indigo-900/50 text-indigo-100 p-4 rounded-lg'
        }`}
      >
        {orderDetails ? <OrderBox order={orderDetails} /> : message.text}
      </div>
    </div>
  );
};

export const ChatArea: IComponent<ChatAreaProps> = ({ messages, onParseOrder }) => (
  <div className='flex-1 overflow-auto p-8'>
    <div className='max-w-4xl mx-auto'>
      {messages.length === 0 ? (
        <>
          <LogoHeader />
          <ExamplesGrid />
        </>
      ) : (
        <div className='space-y-4'>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} onParseOrder={onParseOrder} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const ExamplesGrid = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
    <div className='bg-indigo-900/50 p-4 rounded-lg'>
      <h3 className='font-semibold mb-2'>Example</h3>
      <p>What is the yield on Aave V3?</p>
    </div>
    <div className='bg-indigo-900/50 p-4 rounded-lg'>
      <h3 className='font-semibold mb-2'>Example</h3>
      <p>What is the yield on Compound?</p>
    </div>
    <div className='bg-indigo-900/50 p-4 rounded-lg'>
      <h3 className='font-semibold mb-2'>Example</h3>
      <p>How to get max profit on Aave V3?</p>
    </div>
  </div>
);

const LogoHeader = () => (
  <div className='flex justify-center mb-12'>
    <div className='flex items-center gap-3 bg-indigo-900/50 px-4 py-2 rounded-lg'>
      <Image src='/favicon.ico' alt='Yieldon Logo' className='h-8 w-8' width={32} height={32} />
      <span className='text-2xl font-semibold text-indigo-100'>Yieldon</span>
    </div>
  </div>
);
