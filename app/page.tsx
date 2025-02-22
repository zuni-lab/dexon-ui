import { RouterMeta } from '@/constants/router';
import type { Metadata } from 'next';
import ConnectWallet from './ConnectWallet';

export const metadata: Metadata = RouterMeta.Home;

export default function HomePage() {
  return (
    <div>
      <ConnectWallet />
    </div>
  );
}
