import { Tokens } from '@/constants/tokens';
import axios from 'axios';

export const coingeckoClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_COINGECKO_API_URL,
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY
  }
});

export const coingeckoService = {
  async getTokenStats(token: TradeableToken): Promise<TokenStats> {
    const currentTime = Math.floor(Date.now() / 1000);
    const from = currentTime - 24 * 3600;
    const to = currentTime;

    const params = new URLSearchParams({
      vs_currency: 'usd',
      from: from.toString(),
      to: to.toString(),
      precision: '2'
    });

    const response = await coingeckoClient.get<MarketChartDataResponse>(
      `/coins/${Tokens[token].underlying}/market_chart/range?${params}`
    );
    const { prices, total_volumes, market_caps } = response.data;

    const price = prices[prices.length - 1][1];
    const marketCap = market_caps[market_caps.length - 1][1];
    const volume24h = total_volumes[total_volumes.length - 1][1];

    const prices24h = prices.map((price) => price[1]);

    const price24hChange = price - prices24h[0];
    const high24hPrice = Math.max(...prices24h);
    const low24hPrice = Math.min(...prices24h);

    return {
      price,
      price24hChange,
      high24hPrice,
      low24hPrice,
      marketCap,
      volume24h
    };
  }
};
