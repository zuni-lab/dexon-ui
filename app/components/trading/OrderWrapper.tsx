'use client';

import { BuyIcon } from '@/components/icons/Buy';
import { SellIcon } from '@/components/icons/Sell';
import { Button } from '@/components/shadcn/Button';
import { OrderSide } from '@/constants/orders';
import { cn } from '@/utils/shadcn';
import { createContext, use, useState } from 'react';
import { ConditionOrder } from './ConditionOrder';
import { MarketOrder } from './MarketOrder';
export const OrderSideContext = createContext<OrderSide | null>(null);

export const useOrderSide = () => {
  const orderSide = use(OrderSideContext);
  if (orderSide === null) {
    throw new Error('useOrderSide must be used within an OrderWrapper');
  }
  return orderSide;
};

interface OrderWrapperProps {
  type: OrderType;
}

export const OrderWrapper: IComponent<OrderWrapperProps> = ({ type }) => {
  const [orderSide, setOrderSide] = useState<OrderSide>(OrderSide.BUY);

  return (
    <OrderSideContext.Provider value={orderSide}>
      <div className='bg-purple3 h-full rounded-xl'>
        <div className='grid grid-cols-2 h-[52px]'>
          <OrderButton
            isActive={orderSide === OrderSide.BUY}
            icon={<BuyIcon />}
            onClick={() => setOrderSide(OrderSide.BUY)}
            text='Buy'
          />

          <OrderButton
            isActive={orderSide === OrderSide.SELL}
            icon={<SellIcon />}
            onClick={() => setOrderSide(OrderSide.SELL)}
            text='Sell'
          />
        </div>
        {type === 'market' && <MarketOrder />}
        {type === 'limit' && <ConditionOrder orderType='limit' />}
        {type === 'stop' && <ConditionOrder orderType='stop' />}
      </div>
    </OrderSideContext.Provider>
  );
};

const OrderButton = ({
  isActive,
  icon,
  onClick,
  text
}: { isActive: boolean; icon: React.ReactNode; onClick: () => void; text: string }) => {
  return (
    <Button
      variant='ghost'
      className={cn(
        { 'bg-purple2 text-white': isActive },
        'h-full font-semibold hover:bg-purple2 flex justify-center items-center gap-2.5 p-4'
      )}
      onClick={onClick}
    >
      <span className='text-sm'>{text}</span>
      {icon}
    </Button>
  );
};
