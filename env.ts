import { z } from 'zod';

const ProjectENVSchema = z.object({
  /**
   * Feature flags, comma separated
   */
  NEXT_PUBLIC_ENV: z.string().default('development'),
  NEXT_PUBLIC_ALCHEMY_ID: z.string().min(1, 'Alchemy ID is required'),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1, 'WalletConnect Project ID is required'),
  NEXT_PUBLIC_API_URL: z.string().min(1, 'API URL is required'),
  NEXT_PUBLIC_MONAD_TESTNET_RPC_URL: z.string().default('https://testnet-rpc.monad.xyz'),
  NEXT_PUBLIC_DEXON_CONTRACT: z.string().startsWith('0x').min(42, 'Dexon contract address is required')
});

/**
 * Return system ENV with parsed values
 */
export const ProjectENV = ProjectENVSchema.parse({
  NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_MONAD_TESTNET_RPC_URL: process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL,
  NEXT_PUBLIC_DEXON_CONTRACT: process.env.NEXT_PUBLIC_DEXON_CONTRACT
});
