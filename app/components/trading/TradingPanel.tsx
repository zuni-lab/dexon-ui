'use client';

import { Button } from '@/components/shadcn/Button';
import { Input } from '@/components/shadcn/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/Tabs';
import { cn } from '@/utils/shadcn';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import BuySellToggle from './BuySellToggle';
import TradingPriceHeader from './TradingPriceHeader';

export const TradingPanel: IComponent<{ className?: string }> = ({ className }) => {
  const [tradeType, setTradeType] = useState('buy');

  return (
    <div className={cn('bg-[#251D46] rounded-xl p-4', className)}>
      <TradingPriceHeader />

      {/* Trading Type Tabs */}
      <Tabs defaultValue='market' className='mb-6'>
        <TabsList className='grid grid-cols-4 bg-[#1E1738]'>
          <TabsTrigger value='market' className='data-[state=active]:bg-[#322959]'>
            Market
          </TabsTrigger>
          <TabsTrigger value='limit' className='data-[state=active]:bg-[#322959]'>
            Limit
          </TabsTrigger>
          <TabsTrigger value='stop' className='data-[state=active]:bg-[#322959]'>
            Stop
          </TabsTrigger>
          <TabsTrigger value='twap' className='data-[state=active]:bg-[#322959]'>
            TWAP
          </TabsTrigger>
        </TabsList>

        <TabsContent value='market'>
          <BuySellToggle tradeType={tradeType} setTradeType={setTradeType} />

          {/* Amount Input */}
          <div className='mb-6'>
            <div className='block text-sm mb-2'>Amount to buy</div>
            <div className='relative mb-4'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2'>
                <div className='w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs'>
                  Ξ
                </div>
                <span>ETH</span>
              </div>
              <Input
                type='tex`t'
                value='0.0'
                className='bg-[#322959] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-[4.5rem]'
              />
            </div>

            <div className='block text-sm mb-2'>Market Price</div>
            <Input
              type='text'
              value='1,234.56'
              className='bg-[#322959] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-4'
            />

            <div className='block text-sm mb-2'>Estimated Recieve Amount</div>
            <Input
              type='text'
              value='0.00'
              className='bg-[#322959] border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
              readOnly
            />
          </div>

          {/* Advanced Toggle */}
          <Button variant='ghost' className='w-full justify-between text-white mb-4'>
            <span>Advanced</span>
            <ChevronDown className='w-4 h-4' />
          </Button>

          {/* Submit Button */}
          <Button className='w-full bg-[#6A3AD5] hover:bg-[#7b4be6] py-6 text-lg'>
            {tradeType === 'buy' ? 'Buy' : 'Sell'} Market Order
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
