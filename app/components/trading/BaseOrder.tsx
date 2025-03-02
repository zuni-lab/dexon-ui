'use client';

import ConnectWallet from '@/components/ConnectWallet';
import { Button } from '@/components/shadcn/Button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/shadcn/Dialog';
import { Input } from '@/components/shadcn/Input';
import { OrderSide } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { cx } from '@/utils/tools';
import { ChevronDown, Loader2 } from 'lucide-react';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

interface BaseOrderProps {
  orderSide: OrderSide;
  amount: string;
  priceRate: string;
  usdcAmount: string;
  selectedToken: Token;
  isPending: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenSelect: (token: Token) => void;
  onOrderSubmit: () => Promise<void>;
  children?: React.ReactNode;
}

export const BaseOrder: React.FC<BaseOrderProps> = ({
  orderSide,
  amount,
  priceRate,
  selectedToken,
  isPending,
  onAmountChange,
  onTokenSelect,
  onOrderSubmit,
  children
}) => {
  const { address, isConnected } = useAccount();
  const { data: tokenBalance } = useReadContract({
    abi: erc20Abi,
    address: selectedToken.address,
    functionName: 'balanceOf',
    args: [address || zeroAddress]
  });

  return (
    <div className='flex flex-col gap-6'>
      {/* Amount Input with Token Selection */}
      <div>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm text-gray-400'>Amount</div>
          <div className='text-xs'>
            Balance:{' '}
            {tokenBalance ? Number(formatUnits(tokenBalance, selectedToken.decimals)).toFixed(2) : '0.00'}{' '}
            {selectedToken?.symbol}
          </div>
        </div>

        <div className='relative'>
          <Input
            type='text'
            placeholder='0.0'
            className='bg-[#322959] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 pr-32'
            value={amount}
            onChange={onAmountChange}
          />

          <TokenSelector selectedToken={selectedToken} onTokenSelect={onTokenSelect} />
        </div>
        <div className='text-sm text-gray-400 mt-2'>
          1 {selectedToken.symbol} ≈ ${priceRate}
        </div>
      </div>

      {children}

      {isConnected ? (
        <Button className='w-full py-6 text-lg font-medium' onClick={onOrderSubmit} disabled={isPending}>
          {isPending && <Loader2 className='w-4 h-4 text-gray-400 animate-spin' />}
          {isPending
            ? 'Submitting...'
            : `${orderSide === OrderSide.BUY ? 'Buy' : 'Sell'} ${selectedToken.symbol}`}
        </Button>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

const TokenSelector = ({
  selectedToken,
  onTokenSelect
}: { selectedToken: Token; onTokenSelect: (token: Token) => void }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type='button'
        className='absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 bg-[#251D46] rounded-lg flex items-center gap-2 hover:bg-[#3a2b6a] transition-colors'
      >
        <div className='w-6 h-6 rounded-full flex items-center justify-center text-sm'>C</div>
        <span>{selectedToken.symbol}</span>
        <ChevronDown className='w-4 h-4 text-gray-400' />
      </button>
    </DialogTrigger>
    <DialogContent className='bg-[#251D46] border-[#322959] p-4 w-80'>
      <div className='space-y-2'>
        {Object.values(Tokens).map((token) => (
          <button
            type='button'
            key={token.symbol}
            onClick={() => onTokenSelect(token)}
            className='w-full p-3 rounded-lg hover:bg-[#322959] flex items-center justify-between group transition-colors'
          >
            <div className='flex items-center gap-3'>
              <div className={cx('w-8 h-8 rounded-full flex items-center justify-center text-lg')}>
                TokenIcon
              </div>
              <div className='text-left'>
                <div className='font-medium'>{token.symbol}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);
