import { Input } from "@/components/shadcn/Input";
import { Tokens, TokensUI } from "@/constants/tokens";
import { formatNumber } from "@/utils/tools";
import { Balance } from "./Balance";
import { Coin } from "./Coin";

export const StableCoinSection: IComponent<{
  orderSide: OrderSide;
  usdcBalance: bigint | undefined;
  usdcAmount: string;
}> = ({ orderSide, usdcAmount, usdcBalance }) => {
  return (
    <div className="flex flex-col gap-1 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">
          {orderSide === "BUY" ? "You pay" : "You receive"}
        </h2>
        <Balance balance={usdcBalance} token={Tokens.USDC} />
      </div>
      <StableCoin
        amount={usdcAmount}
        icon={TokensUI.USDC.icon}
        symbol={"USDC"}
      />
    </div>
  );
};

export const StableCoin: IComponent<{
  amount: string;
  icon: React.ReactNode;
  symbol: string;
}> = ({ amount, icon, symbol }) => {
  return (
    <div className="relative">
      <Input
        placeholder="0.0"
        value={formatNumber(Number(amount))}
        readOnly
        className="!pr-0 h-16 border-0 bg-transparent py-0 pl-0 font-medium text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Coin
        type="button"
        symbol={symbol}
        icon={icon}
        className="-translate-y-1/2 absolute top-1/2 right-0 cursor-default"
      />
    </div>
  );
};
