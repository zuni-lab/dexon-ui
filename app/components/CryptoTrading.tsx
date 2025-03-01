'use client';

import ChartPanel from './trading/ChartPanel';
import TradingPanel from './trading/TradingPanel';

export default function CryptoTrading() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 p-4'>
      <ChartPanel />
      <TradingPanel />
    </div>
  );
}
