type TriggerCondition = ">" | "<" | "=";

interface OrderDetails {
  trigger_condition: TriggerCondition;
  trigger_price: string;
  token_name: string;
  amount: string;
  order_side: OrderSide;
}

type OrderType = "MARKET" | "LIMIT" | "STOP" | "TWAP";
type OrderSide = "BUY" | "SELL";
