'use client';

import { Button } from '@/components/shadcn/Button';
import { OrderSide } from '@/constants/orders';
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
      <div className='bg-purple3 rounded-xl'>
        <div className='grid grid-cols-2 gap-1'>
          <Button
            variant='ghost'
            className={`${
              orderSide === OrderSide.BUY
                ? 'bg-[#251D46] text-white'
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#251D46]/50'
            } rounded-lg`}
            onClick={() => setOrderSide(OrderSide.BUY)}
          >
            {/* <div className='flex items-center gap-2'>
                            <Image src='/BuyIcon.svg' alt='Buy' width={13} height={13} />
                            <span>Buy</span>
                        </div> */}
            Buyd
          </Button>
          <Button
            variant='ghost'
            className={`${
              orderSide === OrderSide.SELL
                ? 'bg-[#251D46] text-white'
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#251D46]/50'
            } rounded-lg`}
            onClick={() => setOrderSide(OrderSide.SELL)}
          >
            {/* <div className='flex items-center gap-2'>
                            <Image src='/SellIcon.svg' alt='Sell' width={22} height={22} />
                            <span>Sell</span>
                        </div> */}
            Sell
          </Button>
        </div>
      </div>
      {type === 'market' && <MarketOrder />}
      {type === 'limit' && <ConditionOrder orderType='limit' />}
      {type === 'stop' && <ConditionOrder orderType='stop' />}
    </OrderSideContext.Provider>
  );
};
