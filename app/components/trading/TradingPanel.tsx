'use client';

import { cn } from '@/utils/shadcn';
import { TradingHeader } from './TradingHeader';
import { TradingTabs } from './TradingTabs';

export const TradingPanel: IComponent<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-primary rounded-2xl border border-secondary overflow-hidden flex flex-col',
        className
      )}
    >
      <TradingHeader />
      <TradingTabs />
    </div>
  );
};
