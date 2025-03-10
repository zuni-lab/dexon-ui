type TriggerCondition = ">" | "<" | "=";

interface OrderDetails {
  trigger_condition: TriggerCondition;
  trigger_price: string;
  token_name: WrappedTradeableToken;
  amount: string;
  order_side: OrderSide;

  // for TWAP
  interval?: string;
  total_orders?: string;
}

type OrderType = "MARKET" | "LIMIT" | "STOP" | "TWAP";
type OrderSide = "BUY" | "SELL";
