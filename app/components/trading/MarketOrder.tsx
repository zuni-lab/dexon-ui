'use client';

import { Button } from '@/components/shadcn/Button';
import { Tokens, TokensUI } from '@/constants/tokens';
import { useHandleSwap } from '@/hooks/useHandleSwap';
import { useQuotePrice } from '@/hooks/useQuotePrice';
import { useSelectedToken } from '@/state/token';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { erc20Abi, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { Balance } from './Balance';
import { BaseOrder } from './BaseOrder';
import { useOrderSide } from './OrderWrapper';
import { StableCoinSection } from './StableCoin';

export const MarketOrder: React.FC = () => {
  const { address } = useAccount();
  const orderSide = useOrderSide();
  const [amount, setAmount] = useState('');
  const { data: usdcBalance } = useReadContract({
    abi: erc20Abi,
    address: Tokens.USDC.address,
    functionName: 'balanceOf',
    args: [address || zeroAddress]
  });

  const { token: selectedToken } = useSelectedToken();
  const token = Tokens[selectedToken];

  const { priceRate, usdcAmount } = useQuotePrice({
    amount,
    orderSide,
    selectedToken: token
  });

  const { handleSwap, isPending } = useHandleSwap({
    amount,
    orderSide,
    selectedToken: token,
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
      onAmountChange={handleAmountChange}
      onOrderSubmit={handleSwap}
      isPending={isPending}
      renderFooter={() => (
        <div className='bg-purple4/60 mt-4 mx-4 py-2 rounded-xl font-semibold text-lg'>
          <Button variant='ghost' className='w-full justify-between text-white group'>
            <span>Advanced Settings</span>
            <ChevronRight className='w-4 h-4 transition-transform group-data-[state=open]:rotate-90' />
          </Button>
        </div>
      )}
    >
      <StableCoinSection orderSide={orderSide} usdcBalance={usdcBalance} usdcAmount={usdcAmount} />
    </BaseOrder>
  );
};
