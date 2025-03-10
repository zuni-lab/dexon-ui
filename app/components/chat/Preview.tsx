import { format } from "date-fns";

import { BuyIconSolid } from "@/components/icons/Buy";
import { SellIconSolid } from "@/components/icons/Sell";
import { Button } from "@/components/shadcn/Button";
import { Tokens } from "@/constants/tokens";
import { useHandleSwap } from "@/hooks/useHandleSwap";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { usePlaceTwapOrder } from "@/hooks/usePlaceTwapOrder";
import {
  determineOrderType,
  validateOrderDetails,
  validateTwapOrderDetails,
} from "@/utils/order";
import { cn } from "@/utils/shadcn";
import { formatTimeInterval } from "@/utils/tools";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";

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

  try {
    if (orderType === "TWAP") {
      validateTwapOrderDetails(order);
    } else {
      validateOrderDetails(order);
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    return <div>Problem with order details: {error.message}</div>;
  }

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

  const ExecutionComponent =
    orderType === "TWAP" ? Twap : orderType === "MARKET" ? Market : Condition;

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
          {orderType !== "TWAP" && (
            <Item title="Price" value={formattedPrice} />
          )}
          <Item
            title="Amount"
            value={`${formattedAmount} ${order.token_name}`}
          />
          {orderType === "TWAP" ? (
            <>
              <Item
                title="Interval"
                value={`${formatTimeInterval(Number(order.interval ?? 0))}`}
              />
              <Item
                title="Total Orders"
                value={order?.total_orders?.toString() ?? "0"}
              />
              <Item
                title="Total Amount"
                value={`${Number(formattedAmount) * Number(order.total_orders ?? 0)} ${order.token_name}`}
              />
            </>
          ) : (
            <>
              <Item
                title="Trigger"
                value={`Price ${order.trigger_condition} ${formattedPrice}`}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-4 rounded-b-2xl border border-[#382E62] border-t-0 bg-purple2 p-3">
        <ExecutionComponent order={order} orderType={orderType}>
          {({ onSubmit, isPending }) => (
            <Button
              className="flex h-12 w-full gap-1 rounded-lg bg-button font-medium text-white hover:bg-button/80"
              onClick={onSubmit}
              disabled={isPending}
            >
              <OrderButton isPending={isPending} orderSide={order.order_side} />
            </Button>
          )}
        </ExecutionComponent>
      </div>
    </div>
  );
};

interface OrderExecutionProps {
  order: OrderDetails;
  orderType: OrderType;
  children: (props: {
    onSubmit: () => Promise<void>;
    isPending: boolean;
  }) => React.JSX.Element;
}

const Condition = ({
  order,
  orderType,
  children,
}: OrderExecutionProps): React.JSX.Element => {
  const { address } = useAccount();
  const { placeOrder, isPending } = usePlaceOrder({
    amount: order.amount,
    orderSide: order.order_side,
    orderType: orderType as Exclude<OrderType, "MARKET" | "TWAP">,
    selectedToken: Tokens[order.token_name.slice(1) as TokenKey],
    triggerPrice: order.trigger_price,
  });

  const handleSubmit = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      await placeOrder();
    } catch (error) {
      console.error("Place order error:", error);
    }
  }, [address, placeOrder]);

  return children({
    onSubmit: handleSubmit,
    isPending,
  });
};

const Market = ({
  order,
  children,
}: OrderExecutionProps): React.JSX.Element => {
  const { address, chainId } = useAccount();
  const queryClient = useQueryClient();

  const refreshBalances = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["balance", { address: address, chainId: chainId }],
    });
    await queryClient.invalidateQueries({
      queryKey: [
        "readContract",
        {
          address: Tokens.USDC.address,
          args: [address],
          chainId: chainId,
          functionName: "balanceOf",
        },
      ],
    });
  }, [address, queryClient, chainId]);

  const { handleSwap, isPending } = useHandleSwap({
    amount: order.amount,
    orderSide: order.order_side,
    selectedToken: Tokens[order.token_name.slice(1) as TokenKey],
    usdcAmount: (Number(order.amount) * Number(order.trigger_price)).toString(),
    callback: refreshBalances,
  });

  const handleSubmit = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      await handleSwap();
    } catch (error) {
      console.error("Swap error:", error);
    }
  }, [address, handleSwap]);

  return children({
    onSubmit: handleSubmit,
    isPending,
  });
};

const Twap = ({ order, children }: OrderExecutionProps): React.JSX.Element => {
  const { address } = useAccount();

  const { placeTwapOrder, isPending } = usePlaceTwapOrder({
    amount: order.amount,
    orderSide: order.order_side,
    selectedToken: Tokens[order.token_name.slice(1) as TokenKey],
    interval: order?.interval!,
    totalOrders: order?.total_orders!,
  });

  const handleSubmit = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      await placeTwapOrder();
    } catch (error) {
      console.error("Place twap order error:", error);
    }
  }, [address, placeTwapOrder]);

  return children({
    onSubmit: handleSubmit,
    isPending,
  });
};

const OrderButton = ({
  isPending,
  orderSide,
}: { isPending: boolean; orderSide: OrderSide }) => (
  <>
    {isPending ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-gray-400" />
        Submitting...
      </>
    ) : orderSide === "BUY" ? (
      <>
        <BuyIconSolid />
        Buy
      </>
    ) : (
      <>
        <SellIconSolid />
        Sell
      </>
    )}
  </>
);
