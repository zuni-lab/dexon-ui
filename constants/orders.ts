export const OrderRecords: Record<OrderType, string> = {
  market: 'Market',
  limit: 'Limit',
  stop: 'Stop',
  twap: 'Twap'
} as const;

export enum OrderSide {
  BUY = 0,
  SELL = 1
}

export const DEXON_TYPED_DATA = {
  Order: {
    types: {
      Order: [
        { name: 'account', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'path', type: 'bytes' },
        { name: 'amount', type: 'uint256' },
        { name: 'triggerPrice', type: 'uint256' },
        { name: 'slippage', type: 'uint256' },
        { name: 'orderType', type: 'uint8' },
        { name: 'orderSide', type: 'uint8' },
        { name: 'deadline', type: 'uint256' }
      ]
    },
    primaryType: 'Order'
  }
} as const;
