import { ITEMS_PER_PAGE } from "@/constants/orders";
import { formatAmountWithPath, getTokenPairFromPath } from "@/utils/dex";
import { toQueryString } from "@/utils/tools";
import { type Hex } from "viem";
import { apiClient } from "./axios";

interface PaginationResponse<T> {
  data: T[];
  total: number;
}

export type TOrder = OrderResponse & {
  pair: string;
  amount: number;
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
      return {
        ...order,
        pair: getTokenPairFromPath(order.paths),
        amount: Number(formatAmountWithPath(order.paths, BigInt(order.amount))),
      } as TOrder;
    });
    return { orders, total: data.total };
  },
  async getTwapSubOrders(params: {
    wallet: Hex;
    parentId: number;
    offset?: number;
    limit?: number;
  }) {
    if (!params.limit) {
      params.limit = 100;
    }
    if (!params.offset) {
      params.offset = 0;
    }
    const { data } = await apiClient.get<PaginationResponse<OrderResponse>>(
      `/api/orders?${toQueryString(params)}`,
    );
    const orders = data.data.map((order) => {
      return {
        ...order,
        pair: getTokenPairFromPath(order.paths),
        amount: Number(formatAmountWithPath(order.paths, BigInt(order.amount))),
      } as TOrder;
    });
    return orders;
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
