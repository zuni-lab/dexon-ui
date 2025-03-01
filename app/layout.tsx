import './global.scss';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import ProgressBarClient from '@/components/ProgressBar';
import { TransitionLayout } from '@/layouts/TransitionLayout';

import Providers from './provider';
import { WrapperLayout } from './wrapper';

export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'vi-VN' }];
}

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Your DAPP description',
  icons: '/favicon.ico',
  title: 'ZUNI - DAPP'
};

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: TAny;
}) {
  return (
    <html lang={params.lang}>
      <body className={`${font.className}`}>
        <Suspense>
          <ProgressBarClient />
        </Suspense>
        <Providers>
          <TransitionLayout>
            <WrapperLayout>{children}</WrapperLayout>
          </TransitionLayout>
        </Providers>
      </body>
    </html>
  );
}
