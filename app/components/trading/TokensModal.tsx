import { DialogTitle } from '@/components/shadcn/Dialog';

import { DialogContent } from '@/components/shadcn/Dialog';

import { TradeableTokensUI } from '@/constants/tokens';
import { ChevronDown } from 'lucide-react';

import { DialogTrigger } from '@/components/shadcn/Dialog';

import { Dialog } from '@/components/shadcn/Dialog';
import { useState } from 'react';

import { useSelectedToken } from '@/state/token';

import { Tokens } from '@/constants/tokens';
import { cn } from '@/utils/shadcn';

export const TokensModal: IComponent<{
  buttonClassName?: string;
}> = ({ buttonClassName }) => {
  const { token: selectedToken, setToken } = useSelectedToken();
  const [open, setOpen] = useState(false);
  const token = Tokens[selectedToken];
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild className='text-white'>
        <button
          type='button'
          className={cn(
            'px-3 py-2 bg-purple3 rounded-xl flex items-center gap-2 hover:bg-purple2 transition-colors cursor-pointer',
            buttonClassName
          )}
        >
          {TradeableTokensUI[selectedToken as keyof typeof TradeableTokensUI]?.icon}
          <span className='text-white font-semibold'>{token.symbol}</span>
          <ChevronDown className='w-4 h-4 text-gray-300 font-semibold' />
        </button>
      </DialogTrigger>
      <DialogContent className='bg-purple1 border-purple3 p-4 w-[400px] fixed top-1/3 left-1/2 -translate-x-1/2 [&>button]:text-white'>
        <DialogTitle className='text-xl font-semibold text-white flex items-center justify-between'>
          Select Token
        </DialogTitle>
        <div className='flex flex-col gap-2'>
          {Object.entries(TradeableTokensUI).map(([token, { icon }]) => (
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
