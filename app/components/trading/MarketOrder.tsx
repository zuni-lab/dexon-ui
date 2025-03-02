'use client';

import { Button } from '@/components/shadcn/Button';
import { Input } from '@/components/shadcn/Input';
import { Tokens } from '@/constants/tokens';
import { useHandleSwap } from '@/hooks/useHandleSwap';
import { useQuotePrice } from '@/hooks/useQuotePrice';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { BaseOrder } from './BaseOrder';
import { useOrderSide } from './OrderWrapper';

export const MarketOrder: React.FC = () => {
  const orderSide = useOrderSide();
  const [amount, setAmount] = useState('0');
  const [selectedToken, setSelectedToken] = useState(Tokens.ETH);

  const { priceRate, usdcAmount } = useQuotePrice({
    amount,
    orderSide,
    selectedToken
  });

  const { handleSwap, isPending } = useHandleSwap({
    amount,
    orderSide,
    selectedToken,
    usdcAmount
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
    setAmount(e.target.value);
  };

  return (
    <BaseOrder
      orderSide={orderSide}
      amount={amount}
      priceRate={priceRate}
      usdcAmount={usdcAmount}
      selectedToken={selectedToken}
      onAmountChange={handleAmountChange}
      onTokenSelect={setSelectedToken}
      onOrderSubmit={handleSwap}
      isPending={isPending}
    >
      <div className='mb-6'>
        <div className='text-sm text-gray-400 mb-2'>USDC Value</div>
        <Input
          type='text'
          value={usdcAmount}
          className='bg-[#322959] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12'
          readOnly
        />
      </div>

      <div className='border-t border-[#322959] pt-4'>
        <Button variant='ghost' className='w-full justify-between text-white group'>
          <span>Advanced Settings</span>
          <ChevronRight className='w-4 h-4 transition-transform group-data-[state=open]:rotate-90' />
        </Button>
      </div>
    </BaseOrder>
  );
};
