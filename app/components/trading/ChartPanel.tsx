import { cn } from '@/utils/shadcn';
import ChartStats from './ChartStats';
import PriceChart from './PriceChart';
import TokenSelector from './TokenSelector';

export const ChartPanel: IComponent<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('bg-[#1f1544]/80 backdrop-blur-sm rounded-xl p-4', className)}>
      <h2 className='text-xl font-bold mb-4'>Token Price Chart</h2>
      <TokenSelector />
      <ChartStats />
      <PriceChart />
    </div>
  );
};
