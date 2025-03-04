import { coingeckoService } from '@/api/coingecko';
import { useSelectedToken } from '@/state/token';
import { formatNumber } from '@/utils/tools';
import { useQuery } from '@tanstack/react-query';
import { BoxInfo } from '../BoxInfo';

export default function ChartStats() {
  const { token } = useSelectedToken();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', token],
    queryFn: () => coingeckoService.getTokenStats(token)
  });

  if (isLoading || !stats) {
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
      <BoxInfo label='24H High' value={`$${formatNumber(stats.high24hPrice)}`} />
      <BoxInfo label='24H Low' value={`$${formatNumber(stats.low24hPrice)}`} />
      <BoxInfo label='24H Volume (USD)' value={formatNumber(Math.round(stats.volume24h))} />
    </div>
  );
}
