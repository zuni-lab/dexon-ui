'use client';

import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { http, WagmiProvider } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { ProjectENV } from '@env';
import React from 'react';
import { defineChain } from 'viem';

export const monadTestnet = defineChain({
  id: 10143,
  name: 'monadTestnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [ProjectENV.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL]
    }
  },
  testnet: true
});

const Providers = ({ children }: React.PropsWithChildren) => {
  const [client] = React.useState(new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }));

  const config = React.useMemo(
    () =>
      getDefaultConfig({
        appName: 'My RainbowKit App',
        projectId: ProjectENV.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        chains: [monadTestnet],
        ssr: true,
        transports: {
          [monadTestnet.id]: http()
        }
      }),
    []
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
