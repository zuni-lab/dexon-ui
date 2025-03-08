"use client";

import { UNISWAP_SWAP_ROUTER_ABI } from "@/abi/uniswapV3";
import { UNISWAP_SWAP_ROUTER_ADDRESS } from "@/constants/contracts";
import { OrderSide } from "@/constants/orders";
import { Tokens } from "@/constants/tokens";
import { findPaths } from "@/utils/dex";
import { writeContract } from "@wagmi/core";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { maxUint256, parseUnits } from "viem";
import { useAccount, useConfig, usePublicClient } from "wagmi";
import { useApproveToken } from "./useApproveToken";

interface UseHandleSwapProps {
  amount: string;
  orderSide: OrderSide;
  selectedToken: Token;
  usdcAmount: string;
  callback?: () => void;
}

export const useHandleSwap = ({
  amount,
  orderSide,
  selectedToken,
  usdcAmount,
  callback,
}: UseHandleSwapProps) => {
  const [isPending, setIsPending] = useState(false);
  const { address } = useAccount();
  const config = useConfig();
  const publicClient = usePublicClient();
  const { approveToken } = useApproveToken();

  const handleSwap = useCallback(async () => {
    if (!address || !publicClient) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!amount || Number(amount) === 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsPending(true);

      // Check and handle token approvals
      if (orderSide === OrderSide.BUY) {
        const maxUsdcAmount = (Number(usdcAmount) * 1.1).toString();
        const useAmount = parseUnits(maxUsdcAmount, Tokens.USDC.decimals);
        await approveToken({
          token: Tokens.USDC.address,
          spender: UNISWAP_SWAP_ROUTER_ADDRESS,
          amount: useAmount,
        });
      } else {
        const useAmount = parseUnits(amount, selectedToken.decimals);
        await approveToken({
          token: selectedToken.address,
          spender: UNISWAP_SWAP_ROUTER_ADDRESS,
          amount: useAmount,
        });
      }

      // Execute swap
      const path = findPaths(selectedToken.address, Tokens.USDC.address);
      const swapAmount = parseUnits(amount, selectedToken.decimals);

      let swapTx: `0x${string}`;
      if (orderSide === OrderSide.BUY) {
        swapTx = await writeContract(config, {
          address: UNISWAP_SWAP_ROUTER_ADDRESS,
          abi: UNISWAP_SWAP_ROUTER_ABI,
          functionName: "exactOutput",
          args: [
            {
              path,
              amountOut: swapAmount,
              recipient: address,
              amountInMaximum: maxUint256,
            },
          ],
        });
      } else {
        swapTx = await writeContract(config, {
          address: UNISWAP_SWAP_ROUTER_ADDRESS,
          abi: UNISWAP_SWAP_ROUTER_ABI,
          functionName: "exactInput",
          args: [
            {
              path,
              amountIn: swapAmount,
              recipient: address,
              amountOutMinimum: BigInt(0),
            },
          ],
        });
      }

      // Wait for swap transaction
      await publicClient.waitForTransactionReceipt({
        hash: swapTx,
      });

      toast.success("Swap executed successfully!");

      setIsPending(false);

      callback?.();
    } catch (_error) {
      toast.error("Failed to execute swap");
      setIsPending(false);
    }
  }, [
    address,
    amount,
    approveToken,
    config,
    orderSide,
    publicClient,
    selectedToken,
    usdcAmount,
    callback,
  ]);

  return {
    handleSwap,
    isPending,
  };
};
