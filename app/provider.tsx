'use client';

import { ProjectENV } from '@env';
import { RainbowKitProvider, darkTheme, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { monadTestnet } from 'viem/chains';
import { http, WagmiProvider } from 'wagmi';

const Providers = ({ children }: React.PropsWithChildren) => {
  const [client] = React.useState(new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }));

  const config = React.useMemo(
    () =>
      getDefaultConfig({
        appName: 'Dexon',
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
