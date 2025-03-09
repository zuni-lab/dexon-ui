"use client";

import { Toaster } from "@/components/shadcn/Toaster";
import { ProjectENV } from "@env";
import {
  RainbowKitProvider,
  type Theme,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { merge } from "lodash";
import React from "react";
import { monadTestnet } from "viem/chains";
import { http, WagmiProvider } from "wagmi";

const connectBtnTheme = merge(lightTheme(), {
  colors: {
    accentColor: "#251d46",
  },
} as Theme);

const Providers = ({ children }: React.PropsWithChildren) => {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }),
  );

  const config = React.useMemo(
    () =>
      getDefaultConfig({
        appName: "Dexon",
        projectId: ProjectENV.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        chains: [monadTestnet],
        ssr: true,
        transports: {
          [monadTestnet.id]: http(),
        },
      }),
    [],
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider theme={connectBtnTheme}>
          {children}
        </RainbowKitProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
      <Toaster />
    </WagmiProvider>
  );
};

export default Providers;
