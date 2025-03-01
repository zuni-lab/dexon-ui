import { Button } from '@/components/shadcn/Button';
import Image from 'next/image';

interface BuySellToggleProps {
  tradeType: string;
  setTradeType: (type: string) => void;
}

export default function BuySellToggle({ tradeType, setTradeType }: BuySellToggleProps) {
  return (
    <div className='bg-[#322959] rounded-lg p-1 mb-6'>
      <div className='grid grid-cols-2 gap-1'>
        <Button
          variant='ghost'
          className={`${
            tradeType === 'buy'
              ? 'bg-[#251D46] text-white'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#251D46]/50'
          } rounded-lg`}
          onClick={() => setTradeType('buy')}
        >
          <div className='flex items-center gap-2'>
            <Image src='/BuyIcon.svg' alt='Buy' width={13} height={13} />
            <span>Buy</span>
          </div>
        </Button>
        <Button
          variant='ghost'
          className={`${
            tradeType === 'sell'
              ? 'bg-[#251D46] text-white'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#251D46]/50'
          } rounded-lg`}
          onClick={() => setTradeType('sell')}
        >
          <div className='flex items-center gap-2'>
            <Image src='/SellIcon.svg' alt='Sell' width={22} height={22} />
            <span>Sell</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
