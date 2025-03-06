import { format } from 'date-fns';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export const ChatMessages: IComponent<ChatMessagesProps> = ({ messages }) => (
  <div className='space-y-4'>
    {messages.map((message, index) => (
      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-2 font-medium ${
            message.role === 'user' ? 'bg-purple4 text-gray-100' : 'bg-purple3/40 text-gray-300'
          }`}
        >
          <p>{message.text}</p>
          <span className='text-xs opacity-70 mt-1 block'>{format(message.created_at * 1000, 'HH:mm')}</span>
        </div>
      </div>
    ))}
  </div>
);
