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
    <div className='bg-purple4/20 p-4 rounded-lg cursor-pointer hover:bg-purple4/30 transition-colors'>
      <h3 className='font-semibold mb-2 text-purple4'>Market Order</h3>
      <p className='text-sm text-purple4/80'>Buy 1 ETH at market price</p>
    </div>
    <div className='bg-purple4/20 p-4 rounded-lg cursor-pointer hover:bg-purple4/30 transition-colors'>
      <h3 className='font-semibold mb-2 text-purple4'>Limit Order</h3>
      <p className='text-sm text-purple4/80'>Buy ETH when price is below $2000</p>
    </div>
    <div className='bg-purple4/20 p-4 rounded-lg cursor-pointer hover:bg-purple4/30 transition-colors'>
      <h3 className='font-semibold mb-2 text-purple4'>Stop Order</h3>
      <p className='text-sm text-purple4/80'>Sell ETH when price drops below $2200</p>
    </div>
  </div>
);

const LogoHeader = () => (
  <div className='flex flex-col items-center gap-4 mb-12'>
    <div className='flex items-center gap-3 bg-purple4/20 px-4 py-2 rounded-lg'>
      <Image src='/favicon.ico' alt='Dexon Logo' className='h-8 w-8' width={32} height={32} />
      <span className='text-2xl font-semibold text-purple4'>Trading Assistant</span>
    </div>
    <p className='text-center text-purple4/80'>
      I can help you place market, limit, and stop orders. Just tell me what you want to trade!
    </p>
  </div>
);
