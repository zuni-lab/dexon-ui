'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { WalletIcon } from './icons/Wallet';

interface ReadyProps {
  'aria-hidden': boolean;
  style: {
    opacity: number;
    pointerEvents: 'none';
    userSelect: 'none';
  };
}

const ConnectWallet: IComponent<{
  className?: string;
}> = ({ className }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        if (!ready) return null;

        return (
          <div
            {...(!ready
              ? ({
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }
                } as ReadyProps)
              : {})}
            className={`${className}`}
          >
            {(() => {
              if (!account || !chain) {
                return (
                  <button
                    onClick={openConnectModal}
                    type='button'
                    className='flex justify-center items-center gap-2 p-4 bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200 w-[194px]'
                  >
                    <WalletIcon className='w-5 h-5' />
                    <span className='text-white font-medium'>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type='button'
                    className='px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200'
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className='flex items-center gap-3'>
                  {/* <button
                    onClick={openChainModal}
                    type='button'
                    className='flex items-center gap-2 px-4 bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200 h-[52px]'
                  >
                    {chain.hasIcon && (
                      <div className='w-5 h-5'>
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={20}
                            height={20}
                          />
                        )}
                      </div>
                    )}
                    <span className='text-white'>{chain.name}</span>
                  </button> */}
                  <button
                    onClick={openAccountModal}
                    type='button'
                    className='flex items-center gap-2 px-4 py-2 bg-primary rounded-full hover:bg-primary/80 transition-colors duration-200 h-[52px]'
                  >
                    <div className='flex items-center'>
                      <div className='w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500' />
                      <span className='text-white ml-2'>{account.displayName}</span>
                    </div>
                    <span className='text-gray-400'>
                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
