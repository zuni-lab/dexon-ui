import { RouterMeta } from "@/constants/router";
import type { Metadata } from "next";

import { ChartPanel } from "./components/chart/ChartPanel";
import { ChatInterface } from "./components/chat/ChatInterface";
import { OrderHistories } from "./components/order/OrderHistories";
import { TradingPanel } from "./components/trading/TradingPanel";

export const metadata: Metadata = RouterMeta.Home;

export default function HomePage() {
  return (
    <div className="flex grow flex-col gap-4 py-4">
      <div className="flex min-h-[85vh] grow gap-8">
        <ChartPanel className="grow" />
        <TradingPanel className="w-[400px]" />
        <ChatInterface />
      </div>
      <div className="mt-4 w-[calc(100%-400px)] pr-8">
        <OrderHistories className="flex-1" />
      </div>
    </div>
  );
}
