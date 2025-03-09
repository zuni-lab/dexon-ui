"use client";

import { Button } from "@/components/shadcn/Button";
import { Input } from "@/components/shadcn/Input";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Loader2 } from "lucide-react";
import { Balance } from "./Balance";
import { TokensModal } from "./TokensModal";

interface BaseOrderProps {
  orderSide: OrderSide;
  amount: string;
  priceRate: string;
  usdcAmount: string;
  isPending: boolean;
  isConnected: boolean;
  tokenBalance: bigint;
  selectedToken: Token;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderSubmit: () => Promise<void>;
  children?: React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

export const BaseOrder: IComponent<BaseOrderProps> = ({
  orderSide,
  amount,
  priceRate,
  isPending,
  tokenBalance,
  isConnected,
  selectedToken,
  onAmountChange,
  onOrderSubmit,
  renderFooter,
  children,
}) => {
  return (
    <div className="flex grow flex-col">
      <div className="m-2 divide-y-[2px] divide-purple3 rounded-2xl bg-purple2">
        <TokenInput
          token={selectedToken}
          tokenBalance={tokenBalance}
          amount={amount}
          priceRate={priceRate}
          onAmountChange={onAmountChange}
        />
        {children}
      </div>
      {renderFooter?.()}
      <div className="flex grow flex-col justify-end px-4 pb-4">
        {isConnected ? (
          <Button
            className="h-14 w-full rounded-xl bg-button p-4 font-medium text-lg hover:bg-button/80"
            onClick={onOrderSubmit}
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-gray-400" />
            )}
            {isPending
              ? "Submitting..."
              : `${orderSide} ${selectedToken.symbol}`}
          </Button>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                className="h-14 w-full rounded-xl bg-button p-4 font-medium text-lg"
                onClick={openConnectModal}
              >
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
        )}
      </div>
    </div>
  );
};

const TokenInput: IComponent<{
  token: Token;
  tokenBalance?: bigint;
  amount: string;
  priceRate: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ token, tokenBalance, amount, priceRate, onAmountChange }) => {
  return (
    <div className="space-y-1 rounded-t-2xl bg-purple1 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-sm">Amount</h2>
        <Balance balance={tokenBalance || BigInt(0)} token={token} />
      </div>
      <div className="relative">
        <Input
          placeholder="0.0"
          value={amount}
          onChange={onAmountChange}
          className="!pr-0 h-16 border-0 bg-transparent py-0 pl-0 font-medium text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <TokensModal buttonClassName="absolute right-0 top-1/2 -translate-y-1/2" />
      </div>
      <div className="text-right text-gray-400 text-xs">
        1 {token.symbol} ≈ ${priceRate}
      </div>
    </div>
  );
};
