'use client';

import { cn } from '@/utils/shadcn';
import { createContext, use, useState } from 'react';
import ChartStats from './ChartStats';
import PriceChart from './PriceChart';
import { TokenSelector } from './TokenSelector';

const SelectedToken = createContext<{
  token: TokenKey;
  setToken: (token: TokenKey) => void;
} | null>(null);

export const useSelectedToken = () => {
  const context = use(SelectedToken);
  if (!context) {
    throw new Error('useSelectedToken must be used within a SelectedTokenProvider');
  }
  return context;
};

export const ChartPanel: IComponent<{
  className?: string;
}> = ({ className }) => {
  const [token, setToken] = useState<TokenKey>('ETH');
  return (
    <SelectedToken.Provider value={{ token, setToken }}>
      <div
        className={cn(
          'rounded-2xl border border-secondary bg-primary/90 backdrop-blur-lg divide-y divide-secondary',
          className
        )}
      >
        <div className='px-6 flex justify-between items-center py-4'>
          <TokenSelector />
          <ChartStats />
        </div>
        <div className='py-4'>
          <PriceChart />
        </div>
      </div>
    </SelectedToken.Provider>
  );
};
