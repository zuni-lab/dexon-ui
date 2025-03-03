import { coingeckoService } from '@/api/coingecko';
import { create } from 'zustand';

interface TokenState {
  token: TradeableToken;
  stats?: TokenStats;
  loading: boolean;
  setToken: (token: TradeableToken) => void;
  fetchStats: () => Promise<void>;
}

const COINGECKO_TOKEN_IDS: Record<TradeableToken, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana'
};

export const useSelectedToken = create<TokenState>((set, get) => ({
  token: 'ETH',
  loading: false,
  setToken: async (token) => {
    set({ token });
    get().fetchStats();
  },
  fetchStats: async () => {
    try {
      set({ loading: true });
      const token = get().token;
      const tokenId = COINGECKO_TOKEN_IDS[token];
      const response = await coingeckoService.getTokenStats(tokenId);
      set({ stats: response, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  }
}));
