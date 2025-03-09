import { coingeckoService } from "@/api/coingecko";
import { useSelectedToken } from "@/state/token";
import { cn } from "@/utils/shadcn";
import { formatNumber, formatReadableUsd } from "@/utils/tools";
import { useQuery } from "@tanstack/react-query";
import { BoxInfo } from "../BoxInfo";

export const TradingHeader: IComponent = () => {
  const { token } = useSelectedToken();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", token],
    queryFn: () => coingeckoService.getTokenStats(token),
  });

  if (isLoading || !stats) {
    return (
      <div className="flex h-14 justify-between bg-purple1 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl text-white">--</span>
          <span className={"text-xs"}>--</span>
        </div>
        <BoxInfo label="Market Cap" value="--" />
      </div>
    );
  }

  const priceChangeRate =
    (stats.price24hChange / (stats.price - stats.price24hChange)) * 100;
  const isPositive = priceChangeRate >= 0;

  return (
    <div className="flex h-14 justify-between bg-purple1 px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="font-bold text-2xl text-white">
          ${formatNumber(stats.price)}
        </span>
        <span
          className={cn("text-xs", isPositive ? "text-green-500" : "text-red")}
        >
          {priceChangeRate.toFixed(2)}%
        </span>
      </div>
      <BoxInfo label="Market Cap" value={formatReadableUsd(stats.marketCap)} />
    </div>
  );
};
