import { formatAmountWithPath } from "@/utils/dex";
import { toQueryString } from "@/utils/tools";
import type { Hex } from "viem";
import { apiClient } from "./axios";

interface PaginationResponse<T> {
  data: T[];
  total: number;
}

export const dexonService = {
  async getOrders(params: {
    wallet: Hex;
    offset: number;
    limit?: number;
    status?: OrderStatus[];
    notStatus?: OrderStatus[];
  }) {
    if (!params.limit) {
      params.limit = 10;
    }
    const { data } = await apiClient.get<PaginationResponse<OrderReponse>>(
      `/orders?${toQueryString(params)}`,
    );
    const orders = data.data.map((order) => ({
      ...order,
      amount: Number(formatAmountWithPath(order.paths, BigInt(order.amount))),
      price: order.price,
    }));
    return { orders, total: data.total };
  },
  async placeOrder(order: PlaceOrderRequest) {
    return apiClient.post("/orders", order);
  },
  async cancelOrder({ orderId, wallet }: { orderId: number; wallet: Hex }) {
    return apiClient.post(`/orders/${orderId}/cancel`, {
      wallet,
    });
  },
};
