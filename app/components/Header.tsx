import { Button } from '@/components/shadcn/Button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Settings, Wallet } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className='flex justify-between items-center p-4'>
      <div className='flex items-center gap-2'>
        <Image src='/Logo.svg' alt='Dexon Logo' width={96} height={96} priority />
      </div>
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full bg-[#1f1544] hover:bg-[#2a1b5a] w-10 h-10'
        >
          <Settings className='w-5 h-5' />
        </Button>
        <ConnectButton />
      </div>
    </header>
  );
}
