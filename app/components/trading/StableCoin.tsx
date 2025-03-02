import { Input } from '@/components/shadcn/Input';
import { cn } from '@/utils/shadcn';
import { formatNumber } from '@/utils/tools';

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
      <button
        type='button'
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-purple3 rounded-xl flex items-center gap-2 hover:bg-purple2 transition-colors cursor-pointer'
        )}
      >
        {icon}
        <span className='text-white font-semibold'>{symbol}</span>
      </button>
    </div>
  );
};
