interface OrderDetails {
  trigger_condition: '>' | '<' | '=';
  trigger_price: string;
  token_name: string;
  amount: string;
  order_side: 'buy' | 'sell';
}

type OrderType = 'market' | 'limit' | 'stop' | 'twap';
