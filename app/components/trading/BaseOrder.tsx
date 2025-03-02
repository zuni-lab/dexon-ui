'use client';

import { Button } from '@/components/shadcn/Button';
import { Input } from '@/components/shadcn/Input';
import { OrderSide } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { useSelectedToken } from '@/state/token';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Loader2 } from 'lucide-react';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { Balance } from './Balance';
import { TokensModal } from './TokensModal';

interface BaseOrderProps {
  orderSide: OrderSide;
  amount: string;
  priceRate: string;
  usdcAmount: string;
  isPending: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderSubmit: () => Promise<void>;
  children?: React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

export const BaseOrder: React.FC<BaseOrderProps> = ({
  orderSide,
  amount,
  priceRate,
  isPending,
  onAmountChange,
  onOrderSubmit,
  children,
  renderFooter
}) => {
  const { token: selectedToken } = useSelectedToken();
  const token = Tokens[selectedToken];

  const { address, isConnected } = useAccount();

  const { data: tokenBalance } = useReadContract({
    abi: erc20Abi,
    address: token.address,
    functionName: 'balanceOf',
    args: [address || zeroAddress]
  });

  return (
    <div className='flex flex-col grow'>
      <div className='m-2 bg-purple2 rounded-2xl'>
        <TokenInput
          token={token}
          tokenBalance={tokenBalance}
          amount={amount}
          priceRate={priceRate}
          onAmountChange={onAmountChange}
        />
        {children}
      </div>
      {renderFooter?.()}
      <div className='px-4 pb-4 grow flex flex-col justify-end'>
        {isConnected ? (
          <Button
            className='w-full p-4 h-14 rounded-xl text-lg font-medium bg-button'
            onClick={onOrderSubmit}
            disabled={isPending}
          >
            {isPending && <Loader2 className='w-4 h-4 text-gray-400 animate-spin' />}
            {isPending ? 'Submitting...' : `${orderSide === OrderSide.BUY ? 'Buy' : 'Sell'} ${token.symbol}`}
          </Button>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                className='w-full p-4 h-14 rounded-xl text-lg font-medium bg-button'
                onClick={openConnectModal}
              >
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
        )}
      </div>
    </div>
  );
};

const TokenInput: IComponent<{
  token: Token;
  tokenBalance?: bigint;
  amount: string;
  priceRate: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ token, tokenBalance, amount, priceRate, onAmountChange }) => {
  return (
    <div className='bg-purple1 rounded-t-2xl p-4 space-y-1'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-medium'>Amount</h2>
        <Balance balance={tokenBalance || BigInt(0)} token={token} />
      </div>
      <div className='relative'>
        <Input
          placeholder='0.0'
          value={amount}
          onChange={onAmountChange}
          className='bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-16 !pr-0 py-0 pl-0 text-xl font-medium'
        />
        <TokensModal buttonClassName='absolute right-0 top-1/2 -translate-y-1/2' />
      </div>
      <div className='text-xs text-gray-400 text-right'>
        1 {token.symbol} ≈ ${priceRate}
      </div>
    </div>
  );
};
