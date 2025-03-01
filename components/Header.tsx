import { Button } from '@/components/shadcn/Button';
import Link from 'next/link';
import ConnectWallet from './ConnectWallet';
import { LogoSvg } from './icons/LogoSvg';
import { SettingIcon } from './icons/Setting';

export default function Header() {
  return (
    <header className='w-full flex justify-between items-center'>
      <Link href='/'>
        <LogoSvg />
      </Link>
      <div className='flex items-center gap-3'>
        <Button variant='ghost' size='icon' className='rounded-full bg-primary hover:bg-primary/90 w-12 h-12'>
          <SettingIcon className='w-5 h-5' />
        </Button>
        <ConnectWallet />
      </div>
    </header>
  );
}

// <div className='flex items-center gap-2'>
// <Image src='/Logo.svg' alt='Dexon Logo' width={96} height={96} priority />
// </div>

// </div>
