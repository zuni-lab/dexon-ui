'use client';
import { Suspense, useEffect } from 'react';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { Footer } from '@/components/Footer';
import { Authentication } from './Authentication';

export const WrapperClientLayout: IComponent = ({ children }) => {
  useEffect(() => {
    injectStyle();
  }, []);

  return (
    <div className='w-full h-auto relative text-white'>
      {children}
      <Footer />
      <Suspense>
        <Authentication />
      </Suspense>
    </div>
  );
};
