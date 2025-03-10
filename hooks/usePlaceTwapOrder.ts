"use client";

import { dexonService } from "@/api/dexon";
import { DEXON_ADDRESS } from "@/constants/contracts";
import {
  DEXON_TYPED_DATA,
  OrderSideMapping,
  OrderTypeMapping,
} from "@/constants/orders";
import { Tokens } from "@/constants/tokens";
import { findPaths, findPoolIds } from "@/utils/dex";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { maxUint256, parseUnits } from "viem";
import {
  useAccount,
  useConfig,
  usePublicClient,
  useSignTypedData,
} from "wagmi";
import { useApproveToken } from "./useApproveToken";

interface UseTwapPlaceOrderProps {
  amount: string;
  orderSide: OrderSide;
  selectedToken: Token;
  interval: string;
  totalOrders: string;
}

export const usePlaceTwapOrder = ({
  amount,
  orderSide,
  selectedToken,
  interval,
  totalOrders,
}: UseTwapPlaceOrderProps) => {
  const [isPending, setIsPending] = useState(false);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const config = useConfig();
  const { signTypedDataAsync } = useSignTypedData();
  const { approveToken } = useApproveToken();

  const queryClient = useQueryClient();
  const { mutateAsync: placeOrderApi } = useMutation({
    mutationFn: (order: PlaceOrderRequest) => dexonService.placeOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", address, "OPEN"],
      });
    },
  });

  const placeTwapOrder = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!config) {
      throw new Error("Config not found");
    }

    if (!amount || Number(amount) === 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!interval || Number(interval) === 0) {
      toast.error("Please enter a valid interval");
      return;
    }

    if (!totalOrders || Number(totalOrders) === 0) {
      toast.error("Please enter a valid total orders");
      return;
    }

    try {
      setIsPending(true);

      // Generate nonce using timestamp
      const nonce = BigInt(new Date().getTime());

      // Get path for token swap
      const path = findPaths(selectedToken.address, Tokens.USDC.address);

      if (!publicClient) {
        throw new Error("Public client not found");
      }

      // Check and handle token approvals
      if (orderSide === "BUY") {
        await approveToken({
          token: Tokens.USDC.address,
          spender: DEXON_ADDRESS,
          amount: maxUint256,
        });
      } else {
        const useAmount = parseUnits(amount, selectedToken.decimals);
        await approveToken({
          token: selectedToken.address,
          spender: DEXON_ADDRESS,
          amount: useAmount,
        });
      }

      // Get EIP-712 domain
      const { domain } = await publicClient.getEip712Domain({
        address: DEXON_ADDRESS,
      });

      // Prepare order data
      const order = {
        account: address,
        nonce,
        path,
        amount: parseUnits(amount, selectedToken.decimals),
        orderSide: OrderSideMapping[orderSide],
        interval: BigInt(interval) * BigInt(60),
        totalOrders: BigInt(totalOrders),
        startTimestamp: BigInt(
          Math.floor(new Date().getTime() / 1000) + 2 * 60,
        ),
      };

      // Sign order with EIP-712
      const signature = await signTypedDataAsync({
        domain: {
          name: domain.name,
          version: domain.version,
          chainId: domain.chainId,
          verifyingContract: domain.verifyingContract,
        },
        types: DEXON_TYPED_DATA.TwapOrder.types,
        primaryType: DEXON_TYPED_DATA.TwapOrder.primaryType,
        message: order,
      });

      const { status } = await placeOrderApi({
        wallet: order.account,
        nonce: order.nonce.toString(),
        poolIds: findPoolIds(selectedToken.address, Tokens.USDC.address),
        side: orderSide,
        type: "TWAP",
        price: "0",
        amount: order.amount.toString(),
        paths: order.path,
        deadline: new Date().getTime() + 24000 * 3600000,
        slippage: 0,
        signature,
        twapExecutedTimes: Number(order.totalOrders),
        twapIntervalSeconds: Number(order.interval),
        twapStartedAt: Number(order.startTimestamp),
      });

      if (status !== 200) {
        throw new Error("Failed to submit order");
      }

      toast.success("TWAP order placed successfully!");
    } catch (_error) {
      toast.error("Failed to place order");
    } finally {
      setIsPending(false);
    }
  }, [
    address,
    amount,
    approveToken,
    config,
    orderSide,
    placeOrderApi,
    publicClient,
    selectedToken,
    signTypedDataAsync,
    interval,
    totalOrders,
  ]);

  return {
    placeTwapOrder,
    isPending,
  };
};
