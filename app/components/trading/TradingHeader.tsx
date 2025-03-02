import { cn } from '@/utils/shadcn';

export const TradingHeader: IComponent = () => {
  return (
    <div className='flex justify-between h-14 px-6 py-4 bg-purple1'>
      <PriceSection />
      <Item label='Borrow Rate' value='0.0034% /hr' />
      <Item label='Available Liq.' value='$2.50M' />
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

const Item: IComponent<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className='flex flex-col gap-.5 items-center justify-center text-white font-semibold'>
      <span className='text-[10px] opacity-40'>{label}</span>
      <span className='text-xs font-bold'>{value}</span>
    </div>
  );
};
