import { useSelectedToken } from '@/state/token';
import { cn } from '@/utils/shadcn';

const pools: Record<TradeableToken, string> = {
  ETH: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
  BTC: '0x4585fe77225b41b697c938b018e2ac67ac5a20c0',
  SOL: '0x127452f3f9cdc0389b0bf59ce6131aa3bd763598'
};

export const PriceChart: IComponent<{
  className?: string;
}> = ({ className }) => {
  const { token } = useSelectedToken();

  return (
    <div className={cn('relative', className)}>
      <iframe
        height='100%'
        width='100%'
        id='geckoterminal-embed'
        title='GeckoTerminal Embed'
        src={`https://www.geckoterminal.com/eth/pools/${pools[token]}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=1d`}
        allow='clipboard-write'
        allowFullScreen
        className='rounded-2xl'
      />
    </div>
  );
};
