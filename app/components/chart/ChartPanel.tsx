'use client';

import { useSelectedToken } from '@/state/token';
import { cn } from '@/utils/shadcn';
import { useEffect } from 'react';
import ChartStats from './ChartStats';
import { PriceChart } from './PriceChart';
import { TokenSelector } from './TokenSelector';

export const ChartPanel: IComponent<{
  className?: string;
}> = ({ className }) => {
  const { fetchStats } = useSelectedToken();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div
      className={cn(
        'rounded-2xl border border-secondary bg-primary/90 backdrop-blur-lg divide-y divide-secondary flex flex-col',
        className
      )}
    >
      <div className='px-6 flex justify-between items-center py-4'>
        <TokenSelector />
        <ChartStats />
      </div>
      <PriceChart className='p-6 h-full grow' />
    </div>
  );
};
