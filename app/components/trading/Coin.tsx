import { cn } from "@/utils/shadcn";
import React from "react";

export interface CoinProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  symbol: string;
  icon: React.ReactNode;
}

export const Coin = React.forwardRef<HTMLButtonElement, CoinProps>(
  ({ className, symbol, icon, ...props }, ref) => {
    return (
      <button
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-xl bg-purple3 px-3 py-2 transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      >
        {icon}
        <span className="font-semibold text-white">{symbol}</span>
      </button>
    );
  },
);
