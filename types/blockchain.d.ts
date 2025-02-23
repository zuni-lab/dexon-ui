type Token = {
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
};

type Pool = {
  address: `0x${string}`;
  fee: number;
  token0: Token;
  token1: Token;
};

type TokenKey = 'BTC' | 'ETH' | 'SOL' | 'USDC';
