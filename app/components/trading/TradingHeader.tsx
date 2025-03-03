import { useSelectedToken } from '@/state/token';
import { cn } from '@/utils/shadcn';
import { formatReadableUsd } from '@/utils/tools';
import { BoxInfo } from '../BoxInfo';

export const TradingHeader: IComponent = () => {
  const { stats, loading } = useSelectedToken();

  if (loading || !stats) {
    return (
      <div className='flex justify-between h-14 px-6 py-4 bg-purple1'>
        <div className='flex gap-2 items-center'>
          <span className='text-white font-bold text-2xl'>--</span>
          <span className={'text-xs'}>--</span>
        </div>
        <BoxInfo label='Market Cap' value='--' />
      </div>
    );
  }

  const priceChangeRate = (stats.price24hChange / (stats.price - stats.price24hChange)) * 100;
  const isPositive = priceChangeRate >= 0;

  return (
    <div className='flex justify-between h-14 px-6 py-4 bg-purple1'>
      <div className='flex gap-2 items-center'>
        <span className='text-white font-bold text-2xl'>${stats.price}</span>
        <span className={cn('text-xs', isPositive ? 'text-green-500' : 'text-red')}>
          {!isPositive ? '-' : ''}
          {priceChangeRate.toFixed(2)}%
        </span>
      </div>
      <BoxInfo label='Market Cap' value={formatReadableUsd(stats.marketCap)} />
    </div>
  );
};
