import type { ReactNode } from 'react';

export async function WrapperLayout({ children }: { children: ReactNode }) {
  return <div className='w-full h-full min-h-screen'>{children}</div>;
}
