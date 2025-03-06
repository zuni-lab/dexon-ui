import { Bot } from 'lucide-react';

export const WelcomeHeader = () => (
  <div className='flex flex-col items-center gap-4'>
    <div className='flex items-center gap-3 bg-purple4/20 px-4 py-2 rounded-lg'>
      <Bot className='w-8 h-8 text-white' />
      <span className='text-xl font-semibold text-white'>Zuni Assistant</span>
    </div>
    <div className='text-center text-white/80 text-sm'>
      <p>I can help you place market, limit, and stop orders.</p>
      <p>Just tell me what you want to trade! </p>
    </div>
  </div>
);
