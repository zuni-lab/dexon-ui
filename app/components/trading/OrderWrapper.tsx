"use client";

import { BuyIcon } from "@/components/icons/Buy";
import { SellIcon } from "@/components/icons/Sell";
import { Button } from "@/components/shadcn/Button";
import { cn } from "@/utils/shadcn";
import { createContext, use, useState } from "react";
import { ConditionOrder } from "./ConditionOrder";
import { MarketOrder } from "./MarketOrder";
export const OrderSideContext = createContext<OrderSide | null>(null);

export const useOrderSide = () => {
  const orderSide = use(OrderSideContext);
  if (orderSide === null) {
    throw new Error("useOrderSide must be used within an OrderWrapper");
  }
  return orderSide;
};

interface OrderWrapperProps {
  type: OrderType;
}

export const OrderWrapper: IComponent<OrderWrapperProps> = ({ type }) => {
  const [orderSide, setOrderSide] = useState<OrderSide>("BUY");

  return (
    <OrderSideContext.Provider value={orderSide}>
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-purple3">
        <div className="grid h-[52px] grid-cols-2">
          <OrderButton
            isActive={orderSide === "BUY"}
            icon={<BuyIcon />}
            onClick={() => setOrderSide("BUY")}
            text="Buy"
          />

          <OrderButton
            isActive={orderSide === "SELL"}
            icon={<SellIcon />}
            onClick={() => setOrderSide("SELL")}
            text="Sell"
          />
        </div>
        {type === "MARKET" && <MarketOrder />}
        {type === "LIMIT" && <ConditionOrder orderType="LIMIT" />}
        {type === "STOP" && <ConditionOrder orderType="STOP" />}
      </div>
    </OrderSideContext.Provider>
  );
};

const OrderButton = ({
  isActive,
  icon,
  onClick,
  text,
}: {
  isActive: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  text: string;
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        { "!bg-transparent text-white": isActive },
        "flex h-full items-center justify-center gap-2.5 rounded-none bg-purple2 p-4 font-semibold transition-colors duration-150 hover:text-purple4",
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </Button>
  );
};
