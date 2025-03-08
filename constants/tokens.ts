import {
  BitcoinIcon,
  EthereumIcon,
  SolanaIcon,
  USDCIcon,
} from "@/components/icons/Tokens";
import type React from "react";
import { createElement } from "react";

export const Tokens: Record<TokenKey, Token> = {
  ETH: {
    address: "0x951dbc0e23228a5b5a40f4b845da75e5658ba3e4",
    name: "Wrapped Ether",
    symbol: "WETH",
    underlying: "ethereum",
    decimals: 18,
  },
  BTC: {
    address: "0xbcb4d4effb4820abe4ab77f4349605dc2ebae551",
    name: "Wrapped BTC",
    symbol: "WBTC",
    underlying: "bitcoin",
    decimals: 8,
  },
  SOL: {
    address: "0xe6ae5d42b0952c5a885538ec0aceb8f5c0c3857d",
    name: "Wrapped SOL",
    symbol: "WSOL",
    underlying: "solana",
    decimals: 18,
  },
  USDC: {
    address: "0x9f6006523bbe9d719e83a9f050108dd5463f269d",
    name: "USD Coin",
    symbol: "USDC",
    underlying: "usd",
    decimals: 6,
  },
};

export const TokensUI: Record<
  TokenKey,
  {
    icon: React.ReactNode;
    name: string;
  }
> = {
  ETH: {
    icon: createElement(EthereumIcon),
    name: "Ethereum",
  },
  BTC: {
    icon: createElement(BitcoinIcon),
    name: "Bitcoin",
  },
  SOL: {
    icon: createElement(SolanaIcon),
    name: "Solana",
  },
  USDC: {
    icon: createElement(USDCIcon),
    name: "USD Coin",
  },
};

export const TradeableTokensUI: Record<
  TradeableToken,
  {
    icon: React.ReactNode;
    name: string;
  }
> = {
  ETH: TokensUI.ETH,
  BTC: TokensUI.BTC,
  SOL: TokensUI.SOL,
};
