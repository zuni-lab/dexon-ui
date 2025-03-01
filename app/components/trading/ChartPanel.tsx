import { Button } from '@/components/shadcn/Button';
import ChartStats from './ChartStats';
import PriceChart from './PriceChart';
import TokenSelector from './TokenSelector';

export default function ChartPanel() {
  return (
    <div className='bg-[#1f1544]/80 backdrop-blur-sm rounded-xl p-4'>
      <h2 className='text-xl font-bold mb-4'>Token Price Chart</h2>
      <TokenSelector />
      <ChartStats />
      <PriceChart />
    </div>
  );
}
