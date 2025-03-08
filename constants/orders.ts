export const OrderRecords: Record<OrderType, string> = {
  market: "Market",
  limit: "Limit",
  stop: "Stop",
  twap: "Twap",
} as const;

export const OrderTypeMapping: Record<
  Exclude<OrderType, "market" | "twap">,
  number
> = {
  limit: 0,
  stop: 1,
} as const;

export enum OrderSide {
  BUY = 0,
  SELL = 1,
}

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
