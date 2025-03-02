'use client';

import { Button } from '@/components/shadcn/Button';
import { createContext, useEffect, useState } from 'react';
import { ChatSidebar } from './ChatSidebar';

export const ChatButton: IComponent<{
  onOpen: () => void;
  onClose: () => void;
}> = ({ onOpen }) => {
  return (
    <>
      <Button
        onClick={onOpen}
        variant='ghost'
        className='fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple4/20 hover:bg-purple4/30 border border-purple4/50 p-0 shadow-lg'
      >
        {/* <Image
                    src="/bot-avatar.png" // Make sure to add your bot avatar image to public folder
                    alt="Trading Assistant"
                    width={32}
                    height={32}
                    className="rounded-full"
                /> */}
        <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-purple2' />
      </Button>
    </>
  );
};

export const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 100); // Match this with your animation duration
  };

  return (
    <>
      <ChatButton onOpen={() => setIsOpen(true)} onClose={handleClose} />
      {isOpen && (
        <ChatSidebar
          onClose={handleClose}
          className={`${isClosing ? 'animate-out slide-out-to-right fade-out' : ''} w-1/4`}
        />
      )}
    </>
  );
};
