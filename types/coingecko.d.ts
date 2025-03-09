interface MarketChartDataResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface TokenStats {
  price: number;
  price24hChange: number;
  high24hPrice: number;
  low24hPrice: number;
  marketCap: number;
  volume24h: number;
}
