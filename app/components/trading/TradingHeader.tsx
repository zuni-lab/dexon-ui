import { cn } from '@/utils/shadcn';
import { BoxInfo } from '../BoxInfo';

export const TradingHeader: IComponent = () => {
  return (
    <div className='flex justify-between h-14 px-6 py-4 bg-purple1'>
      <PriceSection />
      <BoxInfo label='Borrow Rate' value='0.0034% /hr' />
      <BoxInfo label='Available Liq.' value='$2.50M' />
    </div>
  );
};

const PriceSection: IComponent = () => {
  const isPositive = true; // TODO: FIX this hardcoded
  return (
    <div className='flex gap-2 items-center'>
      <span className='text-white font-bold text-2xl'>$170.07</span>
      <span className={cn('text-xs', isPositive ? 'text-green-500' : 'text-red')}>
        {!isPositive ? '-' : ''}
        0.93%
      </span>
    </div>
  );
};
