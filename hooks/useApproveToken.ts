"use client";

import { readContract, writeContract } from "@wagmi/core";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type Hex, erc20Abi, maxUint256 } from "viem";
import { useAccount, useConfig, usePublicClient } from "wagmi";

export const useApproveToken = () => {
  const [isPending, setIsPending] = useState(false);
  const { address } = useAccount();
  const config = useConfig();
  const publicClient = usePublicClient();

  const approveToken = useCallback(
    async ({
      token,
      spender,
      amount,
    }: {
      token: Hex;
      spender: Hex;
      amount: bigint;
    }) => {
      if (!address || !publicClient) {
        toast.error("Please connect your wallet");
        return;
      }

      try {
        setIsPending(true);

        const allowance = await readContract(config, {
          abi: erc20Abi,
          address: token,
          functionName: "allowance",
          args: [address, spender],
        });
        if (allowance < amount) {
          const approveTx = await writeContract(config, {
            abi: erc20Abi,
            address: token,
            functionName: "approve",
            args: [spender, maxUint256],
          });

          await publicClient.waitForTransactionReceipt({
            hash: approveTx,
          });
          toast.success("Token approval confirmed");
        }
      } catch (_error) {
        toast.error("Failed to approve token");
        setIsPending(false);
      }
    },
    [address, config, publicClient],
  );

  return {
    approveToken,
    isPending,
  };
};
