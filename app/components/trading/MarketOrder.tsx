'use client';

import { WalletIcon } from '@/components/icons/Wallet';
import { Button } from '@/components/shadcn/Button';
import { Input } from '@/components/shadcn/Input';
import { Tokens } from '@/constants/tokens';
import { useHandleSwap } from '@/hooks/useHandleSwap';
import { useQuotePrice } from '@/hooks/useQuotePrice';
import { useSelectedToken } from '@/state/token';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { BaseOrder } from './BaseOrder';
import { useOrderSide } from './OrderWrapper';

export const MarketOrder: React.FC = () => {
  const { address } = useAccount();
  const orderSide = useOrderSide();
  const [amount, setAmount] = useState('0');
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
    >
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm font-semibold'>USDC Value</div>
          <div className='flex items-center'>
            <WalletIcon className='w-4 h-4 mr-1 opacity-60' />
            <div className='text-sm text-gray-400'>
              {usdcBalance ? Number(formatUnits(usdcBalance, Tokens.USDC.decimals)).toFixed(2) : '0.00'}{' '}
              {Tokens.USDC.symbol}
            </div>
          </div>
        </div>
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
