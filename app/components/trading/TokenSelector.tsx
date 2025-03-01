import { Button } from '@/components/shadcn/Button';

export default function TokenSelector() {
  return (
    <div className='flex gap-2 mb-6'>
      <Button className='rounded-full bg-[#2a1b5a] hover:bg-[#3a2b6a] flex items-center gap-2'>
        <div className='w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs'>
          ≡
        </div>
        <span>SOL</span>
      </Button>
      <Button variant='ghost' className='rounded-full hover:bg-[#2a1b5a] flex items-center gap-2'>
        <div className='w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center'>🦄</div>
        <span>ETH</span>
      </Button>
      <Button variant='ghost' className='rounded-full hover:bg-[#2a1b5a] flex items-center gap-2'>
        <div className='w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold'>
          ₿
        </div>
        <span>WBTC</span>
      </Button>
    </div>
  );
}
