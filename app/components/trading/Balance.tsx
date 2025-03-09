import { WalletIcon } from "@/components/icons/Wallet";
import { formatNumber } from "@/utils/tools";
import { formatUnits } from "viem";

export const Balance: IComponent<{
  balance?: bigint;
  token: Token;
}> = ({ balance, token }) => {
  const b = balance
    ? Number(formatUnits(balance, token.decimals)).toFixed(2)
    : "0.00";
  return (
    <div className="flex items-center">
      <WalletIcon className="mr-1 h-4 w-4 opacity-60" />
      <div className="text-gray-400 text-sm">
        {formatNumber(Number(b))}
        {` $${token.symbol}`}
      </div>
    </div>
  );
};
