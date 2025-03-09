"use client";

import { cn } from "@/utils/shadcn";
import ChartStats from "./ChartStats";
import { PriceChart } from "./PriceChart";
import { TokenSelector } from "./TokenSelector";

export const ChartPanel: IComponent<{
  className?: string;
}> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-secondary rounded-2xl border border-secondary bg-primary/80 blur-0 backdrop-blur-lg",
        className,
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <TokenSelector />
        <ChartStats />
      </div>
      <PriceChart className="h-full grow p-6" />
    </div>
  );
};
