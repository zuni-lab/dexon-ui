type OrderStatus =
  | "PENDING"
  | "PARTIAL_FILLED"
  | "FILLED"
  | "REJECTED"
  | "CANCELLED";

interface OrderResponse {
  id: number;
  wallet: `0x${string}`;
  type: OrderType;
  side: OrderSide;
  price: number;
  amount: string;
  paths: `0x${string}`;
  createdAt: string;
  cancelledAt: string | null;
  filledAt: string | null;
  txHash: `0x${string}` | null;
  status: OrderStatus;
}

interface PlaceOrderRequest {
  wallet: Hex;
  nonce: string;
  poolIds: Hex[];
  side: OrderSide;
  type: Exclude<OrderType, "MARKET">;
  price: string;
  amount: string;
  paths: Hex;
  deadline: number;
  slippage: number;
  signature: Hex;
}
