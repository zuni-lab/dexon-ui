import { Input } from '@/components/shadcn/Input';
import { OrderSide } from '@/constants/orders';
import { Tokens, TokensUI } from '@/constants/tokens';
import { formatNumber } from '@/utils/tools';
import { Balance } from './Balance';
import { Coin } from './Coin';

export const StableCoinSection: IComponent<{
  orderSide: OrderSide;
  usdcBalance: bigint | undefined;
  usdcAmount: string;
}> = ({ orderSide, usdcAmount, usdcBalance }) => {
  return (
    <div className='flex flex-col gap-1 px-4 py-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-semibold'>{orderSide === OrderSide.BUY ? 'You pay' : 'You receive'}</h2>
        <Balance balance={usdcBalance} token={Tokens.USDC} />
      </div>
      <StableCoin amount={usdcAmount} icon={TokensUI.USDC.icon} symbol={'USDC'} />
    </div>
  );
};

export const StableCoin: IComponent<{
  amount: string;
  icon: React.ReactNode;
  symbol: string;
}> = ({ amount, icon, symbol }) => {
  return (
    <div className='relative'>
      <Input
        placeholder='0.0'
        value={formatNumber(Number(amount))}
        readOnly
        className='bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-16 !pr-0 py-0 pl-0 text-xl font-medium'
      />
      <Coin
        type='button'
        symbol={symbol}
        icon={icon}
        className='absolute right-0 top-1/2 -translate-y-1/2 cursor-default'
      />
    </div>
  );
};
