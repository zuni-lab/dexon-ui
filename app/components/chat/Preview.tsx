import { format } from "date-fns";
import { useCallback, useEffect, useRef } from "react";

import { BuyIcon } from "@/components/icons/Buy";
import { SellIcon } from "@/components/icons/Sell";
import { Button } from "@/components/shadcn/Button";
import { determineOrderType } from "@/utils/order";
import { cn } from "@/utils/shadcn";

export const orderTypeColors: Record<OrderType, string> = {
  STOP: "bg-[#EA322D]",
  MARKET: "bg-[#36A9FF]",
  LIMIT: "bg-[#ECA200]",
  TWAP: "bg-[#10BE59]",
};

const Item: IComponent<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <div className="flex items-center justify-between font-semibold text-sm">
    <h2>{title}</h2>
    <span>{value}</span>
  </div>
);

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
    <div>
      <div className="rounded-2xl bg-purple3 p-3">
        This is a preview of your order. Please review before confirming.
        <span className="mt-1 block text-xs">
          {format(timestamp * 1000, "HH:mm")}
        </span>
      </div>
      <div className="mt-2 flex flex-col space-y-4 rounded-t-2xl border border-[#382E62] bg-primary px-4 pt-3 pb-5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full font-medium text-xs",
              orderTypeColors[orderType],
            )}
            style={{
              padding: "5px 12px 4px 12px",
            }}
          >
            {orderType.toUpperCase()}
          </span>
          <span className="ml-auto font-medium">{order.token_name}</span>
        </div>
        <div className="space-y-2">
          <Item title="Price" value={formattedPrice} />
          <Item
            title="Amount"
            value={`${formattedAmount} ${order.token_name}`}
          />
          <Item
            title="Trigger"
            value={`Price ${order.trigger_condition} ${formattedPrice}`}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4 rounded-b-2xl border border-[#382E62] border-t-0 bg-purple2 p-3">
        <Button
          className="flex h-12 w-full gap-1 rounded-lg bg-button font-medium text-white hover:bg-button/80"
          // onClick={onOrderSubmit}
          // disabled={isPending}
        >
          {/* {isPending && (
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-gray-400" />
          )}
          {isPending
            ? "Submitting..."
            : `${orderSide} ${selectedToken.symbol}`} */}
          {order.order_side === "BUY" ? (
            <>
              <BuyIcon />
              Buy
            </>
          ) : (
            <>
              <SellIcon />
              Sell
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

{
  /* <span
className={cn(
  "rounded-md px-3 py-1.5 font-semibold text-sm",
  order.order_side === "BUY" ? "bg-green-600" : "bg-red-600",
)}
>
{order.order_side.toUpperCase()}
</span> */
}
