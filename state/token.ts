import { create } from 'zustand';

interface TokenState {
  token: TradeableToken;
  setToken: (token: TradeableToken) => void;
}

export const useSelectedToken = create<TokenState>((set) => ({
  token: 'ETH',
  setToken: (token) => set({ token })
}));
