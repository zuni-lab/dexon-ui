import { RouterMeta } from '@/constants/router';
import type { Metadata } from 'next';
import Image from 'next/image';
import CryptoTrading from './components/CryptoTrading';
import Header from './components/Header';

export const metadata: Metadata = RouterMeta.Home;

export default function HomePage() {
  return (
    <div className='min-h-screen text-white relative'>
      <div className='absolute inset-0 z-0'>
        <Image
          src='/background.png'
          alt='Cosmic background'
          fill
          priority
          className='object-cover'
          quality={100}
        />
      </div>
      <div className='relative z-10'>
        <div className='p-4'>
          <Header />
          <CryptoTrading />
        </div>
      </div>
    </div>
  );
}
