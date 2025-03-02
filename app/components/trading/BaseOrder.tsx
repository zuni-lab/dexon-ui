'use client';

import ConnectWallet from '@/components/ConnectWallet';
import { WalletIcon } from '@/components/icons/Wallet';
import { Button } from '@/components/shadcn/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@/components/shadcn/Dialog';
import { Input } from '@/components/shadcn/Input';
import { OrderSide } from '@/constants/orders';
import { Tokens, TradeableTokens } from '@/constants/tokens';
import { useSelectedToken } from '@/state/token';
import { cn } from '@/utils/shadcn';
import { cx } from '@/utils/tools';
import { DialogTitle } from '@radix-ui/react-dialog';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

interface BaseOrderProps {
  orderSide: OrderSide;
  amount: string;
  priceRate: string;
  usdcAmount: string;
  isPending: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderSubmit: () => Promise<void>;
  children?: React.ReactNode;
}

export const BaseOrder: React.FC<BaseOrderProps> = ({
  orderSide,
  amount,
  priceRate,
  isPending,
  onAmountChange,
  onOrderSubmit,
  children
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
    <div className='flex flex-col gap-6'>
      {/* Amount Input with Token Selection */}
      <div>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm font-semibold'>Amount</div>
          <div className='flex items-center'>
            <WalletIcon className='w-4 h-4 mr-1 opacity-60' />
            <div className='text-sm text-gray-400'>
              {tokenBalance ? Number(formatUnits(tokenBalance, token.decimals)).toFixed(2) : '0.00'}{' '}
              {token.symbol}
            </div>
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

          <TokenModal />
        </div>
        <div className='text-sm text-gray-400 mt-2'>
          1 {token.symbol} ≈ ${priceRate}
        </div>
      </div>

      {children}

      {isConnected ? (
        <Button className='w-full py-6 text-lg font-medium' onClick={onOrderSubmit} disabled={isPending}>
          {isPending && <Loader2 className='w-4 h-4 text-gray-400 animate-spin' />}
          {isPending ? 'Submitting...' : `${orderSide === OrderSide.BUY ? 'Buy' : 'Sell'} ${token.symbol}`}
        </Button>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

const TokenModal: IComponent = () => {
  const { token: selectedToken, setToken } = useSelectedToken();
  const [open, setOpen] = useState(false);
  const token = Tokens[selectedToken];
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild className='text-white'>
        <button
          type='button'
          className='absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 bg-purple3 rounded-lg flex items-center gap-2 hover:bg-purple2 transition-colors'
        >
          {TradeableTokens[selectedToken as keyof typeof TradeableTokens]?.icon}
          <span className='text-white font-semibold'>{token.symbol}</span>
          <ChevronDown className='w-4 h-4 text-gray-300 font-semibold' />
        </button>
      </DialogTrigger>
      <DialogContent className='bg-purple1 border-purple3 p-4 w-[400px] fixed top-1/3 left-1/2 -translate-x-1/2 [&>button]:text-white'>
        <DialogTitle className='text-xl font-semibold text-white flex items-center justify-between'>
          Select Token
        </DialogTitle>
        <div className='flex flex-col gap-2'>
          {Object.entries(TradeableTokens).map(([token, { icon }]) => (
            <button
              type='button'
              key={token}
              onClick={() => {
                setToken(token as TradeableToken);
                setOpen(false);
              }}
              className={cn(
                'rounded-lg hover:bg-purple2 flex items-center gap-3 px-4 py-3 border-2 border-transparent transition-all duration-150',
                {
                  'bg-purple2 border-purple4': selectedToken === token
                }
              )}
            >
              {icon}
              <div className='flex flex-col items-start'>
                <span className='text-white font-semibold'>
                  {Tokens[token as keyof typeof Tokens].symbol}
                </span>
                <span className='text-gray-400 text-sm'>{Tokens[token as keyof typeof Tokens].name}</span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
