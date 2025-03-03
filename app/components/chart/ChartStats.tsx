import { useSelectedToken } from '@/state/token';
import { formatNumber } from '@/utils/tools';
import { BoxInfo } from '../BoxInfo';

export default function ChartStats() {
  const { stats, loading } = useSelectedToken();

  if (loading || !stats) {
    return (
      <div className='flex justify-end gap-5'>
        <BoxInfo label='24H Change' value='--' />
        <BoxInfo label='24H High' value='--' />
        <BoxInfo label='24H Low' value='--' />
        <BoxInfo label='24H Volume (USD)' value='--' />
      </div>
    );
  }

  const { price24hChange } = stats;
  const isPositive = price24hChange >= 0;
  const changeValue = `${isPositive ? '+' : '-'}$${Math.abs(price24hChange).toFixed(2)}`;

  return (
    <div className='flex justify-end gap-5'>
      <BoxInfo
        label='24H Change'
        value={changeValue}
        valueClassName={isPositive ? 'text-green-500' : 'text-red-500'}
      />
      <BoxInfo label='24H High' value={`$${stats.high24hPrice}`} />
      <BoxInfo label='24H Low' value={`$${stats.low24hPrice}`} />
      <BoxInfo label='24H Volume (USD)' value={formatNumber(Math.round(stats.volume24h))} />
    </div>
  );
}
