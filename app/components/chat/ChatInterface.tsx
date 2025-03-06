'use client';

import { Button } from '@/components/shadcn/Button';
import { ChatSidebar } from './ChatSidebar';

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/shadcn/Drawer';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const ChatInterface: IComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { isConnected } = useAccount();

  return (
    <Drawer open={isOpen} onClose={() => setIsOpen(false)} fixed direction='right' closeThreshold={0.5}>
      <DrawerTrigger asChild className='cursor-pointer'>
        {isConnected ? (
          <Button
            variant={'ghost'}
            className='fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple4/20 hover:bg-purple4/30 border border-purple4/50 shadow-lg cursor-pointer p-[1px]'
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className='relative w-full h-full'>
              <Image src='/bot.svg' alt='chat' fill />
            </div>
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white' />
          </Button>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                variant={'ghost'}
                className='fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple4/20 hover:bg-purple4/30 border border-purple4/50 shadow-lg cursor-pointer p-[1px]'
                onClick={openConnectModal}
              >
                <Wallet className='w-6 h-6' />
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white' />
              </Button>
            )}
          </ConnectButton.Custom>
        )}
      </DrawerTrigger>
      <DrawerContent className='fixed right-0 top-0 left-[calc(100%-480px)] h-screen mt-0 border-none items-end'>
        <DrawerTitle className='hidden' />
        <ChatSidebar className='w-[480px] h-full' onClose={() => setIsOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};
