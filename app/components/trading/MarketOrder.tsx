'use client';

import { Button } from '@/components/shadcn/Button';
import { Tokens } from '@/constants/tokens';
import { useHandleSwap } from '@/hooks/useHandleSwap';
import { useQuotePrice } from '@/hooks/useQuotePrice';
import { useSelectedToken } from '@/state/token';
import { ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';
import { erc20Abi, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { BaseOrder } from './BaseOrder';
import { useOrderSide } from './OrderWrapper';
import { StableCoinSection } from './StableCoin';

export const MarketOrder: IComponent = () => {
  const { address, isConnected } = useAccount();
  const orderSide = useOrderSide();
  const [amount, setAmount] = useState('');
  const { token: selectedToken } = useSelectedToken();
  const token = Tokens[selectedToken];

  const { data: usdcBalance, refetch: refetchUsdcBalance } = useReadContract({
    abi: erc20Abi,
    address: Tokens.USDC.address,
    functionName: 'balanceOf',
    args: [address || zeroAddress]
  });

  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    abi: erc20Abi,
    address: token.address,
    functionName: 'balanceOf',
    args: [address || zeroAddress]
  });

  const { priceRate, usdcAmount } = useQuotePrice({
    amount,
    orderSide,
    selectedToken: token
  });

  const refreshBalances = useCallback(async () => {
    await refetchUsdcBalance();
    await refetchTokenBalance();
  }, [refetchUsdcBalance, refetchTokenBalance]);

  const { handleSwap, isPending } = useHandleSwap({
    amount,
    orderSide,
    selectedToken: token,
    usdcAmount,
    callback: refreshBalances
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
      tokenBalance={tokenBalance || BigInt(0)}
      selectedToken={token}
      isConnected={isConnected}
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
