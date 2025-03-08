import { format } from "date-fns";

import { determineOrderType } from "@/utils/order";
import { cn } from "@/utils/shadcn";

const orderTypeColors: Record<OrderType, string> = {
  MARKET: "bg-blue-500",
  LIMIT: "bg-yellow-500",
  STOP: "bg-red-400",
  TWAP: "bg-purple-500",
};

export const OrderPreview: IComponent<{
  order: OrderDetails;
  timestamp: number;
}> = ({ order, timestamp }) => {
  const orderType = determineOrderType(order);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.parseFloat(order.trigger_price));

  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(Number.parseFloat(order.amount));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-purple4/40 px-4 py-2 font-medium">
        This is a preview of your order. Please review before confirming.
      </div>
      <div className="space-y-2 rounded-2xl border p-4 font-medium">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-md px-3 py-1.5 font-semibold text-sm text-white",
              orderTypeColors[orderType],
            )}
          >
            {orderType.toUpperCase()}
          </span>
          <span
            className={cn(
              "rounded-md px-3 py-1.5 font-semibold text-sm",
              order.order_side === "BUY" ? "bg-green-600" : "bg-red-600",
            )}
          >
            {order.order_side.toUpperCase()}
          </span>
          <span className="ml-auto font-medium text-lg">
            {order.token_name}
          </span>
        </div>
        <div className="space-y-2 [&>h2]:font-medium [&>h2]:text-xl [&_span]:ml-auto">
          <div className="flex items-center">
            <h2>Price</h2>
            <span>{formattedPrice}</span>
          </div>
          <div className="flex items-center">
            <h2>Amount</h2>
            <span>
              {formattedAmount} {order.token_name}
            </span>
          </div>
          <div className="flex items-center">
            <h2>Trigger</h2>
            <span>
              Price {order.trigger_condition} {formattedPrice}
            </span>
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-sm">
            {format(timestamp * 1000, "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
};
