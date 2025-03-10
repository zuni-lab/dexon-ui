"use client";

import { Input } from "@/components/shadcn/Input";
import { Tokens } from "@/constants/tokens";
import { usePlaceTwapOrder } from "@/hooks/usePlaceTwapOrder";
import { useQuotePrice } from "@/hooks/useQuotePrice";
import { useSelectedToken } from "@/state/token";
import { useState } from "react";
import { erc20Abi, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { BaseOrder } from "./BaseOrder";
import { useOrderSide } from "./OrderWrapper";

const TwapConfig: IComponent<{
  interval: string;
  setInterval: (value: string) => void;
  totalOrders: string;
  setTotalOrders: (value: string) => void;
}> = ({ interval, setInterval, totalOrders, setTotalOrders }) => {
  const isValidPositiveInteger = (val: string) => {
    return /^[1-9]\d*$/.test(val);
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidPositiveInteger(e.target.value)) {
      setInterval(e.target.value);
    }
  };

  const handleTotalOrdersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidPositiveInteger(e.target.value)) {
      setTotalOrders(e.target.value);
    }
  };

  return (
    <div className="flex flex-col divide-y-[2px] divide-purple3 bg-purple3">
      <div className="flex flex-col bg-purple2 py-4">
        <div className="flex items-center justify-between px-4">
          <p className="flex items-center font-semibold text-sm">Every</p>
        </div>
        <div className="relative flex items-center px-4">
          <Input
            placeholder="0.0"
            value={interval}
            onChange={handleIntervalChange}
            className="!pr-0 h-16 border-0 bg-transparent py-0 pl-0 font-medium text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-purple3 px-3 py-2 transition-colors"
          >
            <span className="font-semibold text-white">minutes</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col rounded-b-2xl bg-purple2 py-4">
        <div className="flex items-center justify-between px-4">
          <p className="flex items-center font-semibold text-sm">Over</p>
        </div>
        <div className="relative flex items-center px-4">
          <Input
            placeholder="0.0"
            value={totalOrders}
            onChange={handleTotalOrdersChange}
            className="!pr-0 h-16 border-0 bg-transparent py-0 pl-0 font-medium text-xl focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-purple3 px-3 py-2 transition-colors"
          >
            <span className="font-semibold text-white">orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const TwapOrder = () => {
  const { address, isConnected } = useAccount();
  const orderSide = useOrderSide();
  const [amount, setAmount] = useState("");
  const [interval, setInterval] = useState("");
  const [totalOrders, setTotalOrders] = useState("");

  // const { data: usdcBalance } = useReadContract({
  //   abi: erc20Abi,
  //   address: Tokens.USDC.address,
  //   functionName: "balanceOf",
  //   args: [address || zeroAddress],
  // });

  const { token: selectedToken } = useSelectedToken();
  const token = Tokens[selectedToken];

  const { priceRate, usdcAmount } = useQuotePrice({
    amount,
    orderSide,
    selectedToken: token,
  });

  const { data: tokenBalance } = useReadContract({
    abi: erc20Abi,
    address: token.address,
    functionName: "balanceOf",
    args: [address || zeroAddress],
  });

  const { placeTwapOrder, isPending } = usePlaceTwapOrder({
    amount,
    orderSide,
    selectedToken: token,
    interval,
    totalOrders,
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^\d*\.?\d*$/.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };

  return (
    <BaseOrder
      amount={amount}
      priceRate={priceRate}
      usdcAmount={usdcAmount}
      orderSide={orderSide}
      onAmountChange={handleAmountChange}
      onOrderSubmit={placeTwapOrder}
      isPending={isPending}
      isConnected={isConnected}
      tokenBalance={tokenBalance || BigInt(0)}
      selectedToken={token}
    >
      <TwapConfig
        interval={interval}
        setInterval={setInterval}
        totalOrders={totalOrders}
        setTotalOrders={setTotalOrders}
      />
    </BaseOrder>
  );
};
