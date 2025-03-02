import { RouterMeta } from '@/constants/router';
import type { Metadata } from 'next';

import { ChartPanel } from './components/chart/ChartPanel';
import { ChatInterface } from './components/chat/ChatInterface';
import { TradingPanel } from './components/trading/TradingPanel';

export const metadata: Metadata = RouterMeta.Home;

export default function HomePage() {
  return (
    <div className='grow flex gap-8 py-4'>
      <ChartPanel className='grow' />
      <TradingPanel className='w-[400px]' />
      <ChatInterface />
    </div>
  );
}
