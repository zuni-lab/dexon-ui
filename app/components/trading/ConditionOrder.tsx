'use client';

import { WalletIcon } from '@/components/icons/Wallet';
import { Input } from '@/components/shadcn/Input';
import { OrderSide } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { useQuotePrice } from '@/hooks/useQuotePrice';
import { useMemo, useState } from 'react';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { BaseOrder } from './BaseOrder';
import { useOrderSide } from './OrderWrapper';

interface ConditionOrderProps {
  orderType: Exclude<OrderType, 'market' | 'twap'>;
}

export const ConditionOrder: React.FC<ConditionOrderProps> = ({ orderType }) => {
  const { address } = useAccount();
  const orderSide = useOrderSide();
  const [amount, setAmount] = useState('0');
  const [selectedToken, setSelectedToken] = useState(Tokens.ETH);
  const [triggerPrice, setTriggerPrice] = useState('0');
  const { data: usdcBalance } = useReadContract({
    abi: erc20Abi,
    address: Tokens.USDC.address,
    functionName: 'balanceOf',
    args: [address || zeroAddress]
  });

  const { priceRate, usdcAmount } = useQuotePrice({
    amount,
    orderSide,
    selectedToken
  });

  const { placeOrder, isPending } = usePlaceOrder({
    amount,
    orderSide,
    orderType,
    selectedToken,
    triggerPrice
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
    setAmount(e.target.value);
  };

  const triggerCondition = useMemo(() => {
    if (orderType === 'limit') {
      return orderSide === OrderSide.BUY ? '<' : '>';
    }
    if (orderType === 'stop') {
      return orderSide === OrderSide.BUY ? '>' : '<';
    }
    return '';
  }, [orderType, orderSide]);

  return (
    <BaseOrder
      amount={amount}
      priceRate={priceRate}
      usdcAmount={usdcAmount}
      orderSide={orderSide}
      selectedToken={selectedToken}
      onAmountChange={handleAmountChange}
      onTokenSelect={setSelectedToken}
      onOrderSubmit={placeOrder}
      isPending={isPending}
    >
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm font-semibold'>Trigger Price</div>
          <div className='flex items-center'>
            <WalletIcon className='w-4 h-4 mr-1 opacity-60' />
            <div className='text-sm text-gray-400'>
              {usdcBalance ? Number(formatUnits(usdcBalance, Tokens.USDC.decimals)).toFixed(2) : '0.00'}{' '}
              {Tokens.USDC.symbol}
            </div>
          </div>
        </div>
        <div className='relative'>
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>{triggerCondition}</div>
          <Input
            type='text'
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(e.target.value)}
            className='bg-[#322959] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 pl-8'
          />
          <div className='absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 bg-[#251D46] rounded-lg flex items-center gap-2'>
            <div className='w-6 h-6 rounded-full flex items-center justify-center text-sm'>C</div>
            <span>{Tokens.USDC.symbol}</span>
          </div>
        </div>
      </div>

      <div className='border-t border-[#322959] pt-4'>
        <div className='flex flex-row justify-between items-center'>
          <div className='text-sm text-gray-400'>USDC Value</div>
          <div className='text-xs'>${usdcAmount}</div>
        </div>
      </div>
    </BaseOrder>
  );
};
