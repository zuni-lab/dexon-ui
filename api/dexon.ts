import { ITEMS_PER_PAGE } from "@/constants/orders";
import { Tokens } from "@/constants/tokens";
import { formatAmountWithPath } from "@/utils/dex";
import { toQueryString } from "@/utils/tools";
import { type Hex, formatUnits } from "viem";
import { apiClient } from "./axios";

interface PaginationResponse<T> {
  data: T[];
  total: number;
}

export type TOrder = OrderResponse & {
  amount: number;
  price: number;
  actualAmount?: number;
};

export const dexonService = {
  async getOrders(params: {
    wallet: Hex;
    offset: number;
    limit?: number;
    status?: OrderStatus[];
    notStatus?: OrderStatus[];
  }) {
    if (!params.limit) {
      params.limit = ITEMS_PER_PAGE;
    }
    const { data } = await apiClient.get<PaginationResponse<OrderResponse>>(
      `/api/orders?${toQueryString(params)}`,
    );
    const orders = data.data.map((order) => {
      const actualAmount = 0;
      // const {tokenIn,amountIn, amountOut} = order.swapEvent;
      // const usdcAmount = tokenIn.toLowerCase() === Tokens.USDC.address.toLowerCase() ? amountIn : amountOut;
      // const actualAmount = formatUnits(usdcAmount, Tokens.USDC.decimals);
      return {
        ...order,
        amount: Number(formatAmountWithPath(order.paths, BigInt(order.amount))),
        actualAmount,
      } as TOrder;
    });
    return { orders, total: data.total };
  },
  placeOrder(order: PlaceOrderRequest) {
    return apiClient.post("/api/orders", order);
  },
  cancelOrder({ orderId, wallet }: { orderId: number; wallet: Hex }) {
    return apiClient.post(`/api/orders/${orderId}/cancel`, {
      wallet,
    });
  },
};
