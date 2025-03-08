import { RouterMeta } from "@/constants/router";
import type { Metadata } from "next";

import { ChartPanel } from "./components/chart/ChartPanel";
import { ChatInterface } from "./components/chat/ChatInterface";
import { OrderTable } from "./components/order/OrderTable";
import { TradingPanel } from "./components/trading/TradingPanel";

export const metadata: Metadata = RouterMeta.Home;

export default function HomePage() {
  return (
    <div className="flex grow flex-col gap-4 py-4">
      <div className="flex grow gap-8">
        <ChartPanel className="grow" />
        <TradingPanel className="w-[400px]" />
        <ChatInterface />
      </div>
      <OrderTable className="w-full" />
    </div>
  );
}
