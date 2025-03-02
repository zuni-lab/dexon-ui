import { BitcoinIcon, EthereumIcon, SolanaIcon } from '@/components/icons/Tokens';
import type React from 'react';
import { createElement } from 'react';

export const Tokens: Record<TokenKey, Token> = {
  ETH: {
    address: '0x951dbc0e23228a5b5a40f4b845da75e5658ba3e4',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18
  },
  BTC: {
    address: '0xbcb4d4effb4820abe4ab77f4349605dc2ebae551',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8
  },
  SOL: {
    address: '0xe6ae5d42b0952c5a885538ec0aceb8f5c0c3857d',
    name: 'Wrapped SOL',
    symbol: 'WSOL',
    decimals: 18
  },
  USDC: {
    address: '0x9f6006523bbe9d719e83a9f050108dd5463f269d',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6
  }
};

export const TradeableTokens: Record<
  TradeableToken,
  {
    icon: React.ReactNode;
  }
> = {
  ETH: {
    icon: createElement(EthereumIcon)
  },
  BTC: {
    icon: createElement(BitcoinIcon)
  },
  SOL: {
    icon: createElement(SolanaIcon)
  }
};
