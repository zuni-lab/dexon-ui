'use client';

import { Input } from '@/components/shadcn/Input';
import { OrderSide, TriggerEnum } from '@/constants/orders';
import { Tokens, TokensUI } from '@/constants/tokens';
import { usePlaceOrder } from '@/hooks/usePlaceOrder';
import { useQuotePrice } from '@/hooks/useQuotePrice';
import { useSelectedToken } from '@/state/token';
import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { erc20Abi, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { BaseOrder } from './BaseOrder';
import { Coin } from './Coin';
import { useOrderSide } from './OrderWrapper';
import { StableCoinSection } from './StableCoin';

interface ConditionOrderProps {
  orderType: Exclude<OrderType, 'market' | 'twap'>;
}

const TriggerPrice: IComponent<{
  triggerCondition: TriggerEnum;
  triggerPrice: string;
  setTriggerPrice: (value: string) => void;
}> = ({ triggerCondition, triggerPrice, setTriggerPrice }) => {
  return (
    <div className='flex flex-col py-4'>
      <div className='flex items-center justify-between px-4'>
        <p className='text-sm font-semibold flex items-center'>
          When price
          <span
            className={cn(
              'ml-1 bg-gradient-to-r from-green-500 to-yellow-500 text-transparent bg-clip-text font-semibold text-lg',
              {
                'from-green-500 to-yellow-500': triggerCondition === TriggerEnum.GREATER_THAN,
                'from-red-500 to-yellow-500': triggerCondition === TriggerEnum.LESS_THAN
              }
            )}
          >
            {triggerCondition.toUpperCase()}
          </span>
        </p>
      </div>
      <div className='relative flex items-center px-4'>
        <Input
          placeholder='0.0'
          value={triggerPrice}
          onChange={(e) => setTriggerPrice(e.target.value)}
          className='bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-16 !pr-0 py-0 pl-0 text-xl font-medium'
        />
        <Coin
          type='button'
          symbol='USDC'
          icon={TokensUI.USDC.icon}
          className='cursor-default flex-shrink-0'
        />
      </div>
    </div>
  );
};

export const ConditionOrder: React.FC<ConditionOrderProps> = ({ orderType }) => {
  const { address, isConnected } = useAccount();
  const orderSide = useOrderSide();
  const [amount, setAmount] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');

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

  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    abi: erc20Abi,
    address: token.address,
    functionName: 'balanceOf',
    args: [address || zeroAddress]
  });

  const { placeOrder, isPending } = usePlaceOrder({
    amount,
    orderSide,
    orderType,
    selectedToken: token,
    triggerPrice
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
    setAmount(e.target.value);
  };

  const condition =
    orderType === 'limit'
      ? orderSide === OrderSide.BUY
        ? TriggerEnum.LESS_THAN
        : TriggerEnum.GREATER_THAN
      : orderSide === OrderSide.BUY
        ? TriggerEnum.GREATER_THAN
        : TriggerEnum.LESS_THAN;

  return (
    <BaseOrder
      amount={amount}
      priceRate={priceRate}
      usdcAmount={usdcAmount}
      orderSide={orderSide}
      onAmountChange={handleAmountChange}
      onOrderSubmit={placeOrder}
      isPending={isPending}
      isConnected={isConnected}
      tokenBalance={tokenBalance || BigInt(0)}
      selectedToken={token}
    >
      <TriggerPrice
        triggerCondition={condition}
        triggerPrice={triggerPrice}
        setTriggerPrice={setTriggerPrice}
      />
      <StableCoinSection orderSide={orderSide} usdcBalance={usdcBalance} usdcAmount={usdcAmount} />
    </BaseOrder>
  );
};
