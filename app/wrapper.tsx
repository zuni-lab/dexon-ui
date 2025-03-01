'use client';
import { Suspense } from 'react';

import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Footer } from '@/components/Footer';
import Header from '../components/Header';
import { Authentication } from './Authentication';

export const WrapperLayout: IComponent = ({ children }) => {
  return (
    <div className='flex min-h-screen w-screen flex-col items-center space-y-4 pb-4 pt-8 px-16 text-white'>
      <Suspense>
        <Authentication />
      </Suspense>
      <Header />
      <div className='flex-1 w-full flex flex-col'>{children}</div>
      <Footer />
      <BackgroundWrapper />
    </div>
  );
};
