"use client";

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { http, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { ProjectENV } from "@env";
import React from "react";

const Providers = ({ children }: React.PropsWithChildren) => {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  const config = React.useMemo(
    () =>
      getDefaultConfig({
        appName: "My RainbowKit App",
        projectId: ProjectENV.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        chains: [baseSepolia],
        ssr: true,
        transports: {
          [baseSepolia.id]: http(
            `https://base-sepolia.g.alchemy.com/v2/${ProjectENV.NEXT_PUBLIC_ALCHEMY_ID}`
          ),
        },
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
