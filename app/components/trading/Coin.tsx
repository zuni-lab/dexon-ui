import { InputProps } from '@/components/shadcn/Input';
import { cn } from '@/utils/shadcn';
import React, { ButtonHTMLAttributes } from 'react';

export interface CoinProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  symbol: string;
  icon: React.ReactNode;
}

export const Coin = React.forwardRef<HTMLButtonElement, CoinProps>(
  ({ className, symbol, icon, ...props }, ref) => {
    return (
      <button
        className={cn(
          'px-3 py-2 bg-purple3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer',
          className
        )}
        ref={ref}
        {...props}
      >
        {icon}
        <span className='text-white font-semibold'>{symbol}</span>
      </button>
    );
  }
);
