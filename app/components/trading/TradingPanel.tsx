"use client";

import { cn } from "@/utils/shadcn";
import { TradingHeader } from "./TradingHeader";
import { TradingTabs } from "./TradingTabs";

export const TradingPanel: IComponent<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary",
        className,
      )}
    >
      <TradingHeader />
      <TradingTabs />
    </div>
  );
};
