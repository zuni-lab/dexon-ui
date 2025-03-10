export const ITEMS_PER_PAGE = 5;

export const OrderRecords: Record<OrderType, string> = {
  MARKET: "Market",
  LIMIT: "Limit",
  STOP: "Stop",
  TWAP: "Twap",
} as const;

export const OrderTypeMapping: Record<
  Exclude<OrderType, "MARKET" | "TWAP">,
  number
> = {
  LIMIT: 0,
  STOP: 1,
} as const;

export const OrderSideMapping: Record<OrderSide, number> = {
  BUY: 0,
  SELL: 1,
} as const;

export const DEXON_TYPED_DATA = {
  Order: {
    types: {
      Order: [
        { name: "account", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "path", type: "bytes" },
        { name: "amount", type: "uint256" },
        { name: "triggerPrice", type: "uint256" },
        { name: "slippage", type: "uint256" },
        { name: "orderType", type: "uint8" },
        { name: "orderSide", type: "uint8" },
        { name: "deadline", type: "uint256" },
      ],
    },
    primaryType: "Order",
  },
  TwapOrder: {
    types: {
      TwapOrder: [
        { name: "account", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "path", type: "bytes" },
        { name: "amount", type: "uint256" },
        { name: "orderSide", type: "uint8" },
        { name: "interval", type: "uint256" },
        { name: "totalOrders", type: "uint256" },
        { name: "startTimestamp", type: "uint256" },
      ],
    },
    primaryType: "TwapOrder",
  },
} as const;

export enum TriggerEnum {
  GREATER_THAN = "Greater than",
  LESS_THAN = "Less than",
  EQUAL_TO = "Equal to",
}

export const TriggerConditionMapping: Record<TriggerEnum, TriggerCondition> = {
  [TriggerEnum.GREATER_THAN]: ">",
  [TriggerEnum.LESS_THAN]: "<",
  [TriggerEnum.EQUAL_TO]: "=",
} as const;
