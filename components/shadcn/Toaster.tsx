'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-purple2 group-[.toaster]:text-white group-[.toaster]:border-purple3 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-purple4/80',
          actionButton: 'group-[.toast]:bg-button group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-purple3 group-[.toast]:text-purple4'
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
