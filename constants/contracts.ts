import { ProjectENV } from "@env";
import { Tokens } from "./tokens";

export const DEXON_ADDRESS =
  ProjectENV.NEXT_PUBLIC_DEXON_CONTRACT as `0x${string}`;

export const UNISWAP_QUOTER_V2_ADDRESS =
  "0x1b4e313fef15630af3e6f2de550dbf4cc9d3081d";
export const UNISWAP_SWAP_ROUTER_ADDRESS =
  "0x4c4eabd5fb1d1a7234a48692551eaecff8194ca7";
export const FAUCET_ADDRESS = "0xbf5f0cf6b6cee106047af9fd26415ce97baa7f4e";

export const UNISWAP_V3_POOLS: Pool[] = [
  {
    address: "0x70429da31815168EcCDd6898DA18D44d5641540d",
    fee: 3000,
    token0: Tokens.BTC,
    token1: Tokens.USDC,
  },
  {
    address: "0xb8bd80BA7aFA32006Ae4cF7D1dA2Ecb8bBCa9Bf8",
    fee: 3000,
    token0: Tokens.ETH,
    token1: Tokens.USDC,
  },
  {
    address: "0x1BeCb7209e86A3d7D4631E6dC3bc59E897F54aF5",
    fee: 3000,
    token0: Tokens.SOL,
    token1: Tokens.USDC,
  },
];
