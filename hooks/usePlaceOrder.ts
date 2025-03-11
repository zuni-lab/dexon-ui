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
import { parseUnits } from "viem";
import { useAccount, usePublicClient, useSignTypedData } from "wagmi";
import { useApproveToken } from "./useApproveToken";

interface UsePlaceOrderProps {
  amount: string;
  orderSide: OrderSide;
  orderType: Exclude<OrderType, "MARKET" | "TWAP">;
  selectedToken: Token;
  triggerPrice: string;
}

export const usePlaceOrder = ({
  amount,
  orderSide,
  orderType,
  selectedToken,
  triggerPrice,
}: UsePlaceOrderProps) => {
  const [isPending, setIsPending] = useState(false);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { signTypedDataAsync } = useSignTypedData();

  const queryClient = useQueryClient();
  const { approveToken } = useApproveToken();
  const { mutateAsync: placeOrderApi } = useMutation({
    mutationFn: (order: PlaceOrderRequest) => dexonService.placeOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", address, "OPEN"],
      });
    },
  });

  const placeOrder = useCallback(async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!amount || Number(amount) === 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!triggerPrice || Number(triggerPrice) === 0) {
      toast.error("Please enter a valid trigger price");
      return;
    }

    try {
      setIsPending(true);

      // Generate nonce using timestamp
      const nonce = BigInt(new Date().getTime());

      // Get path for token swap
      const path = findPaths(selectedToken.address, Tokens.USDC.address);

      // TODO: Make these configurable in UI
      const slippage = 0.1;
      const deadline = 4102444800n;

      if (!publicClient) {
        throw new Error("Public client not found");
      }

      // Check and handle token approvals
      if (orderSide === "BUY") {
        const maxUsdcAmount = (
          Number(amount) *
          Number(triggerPrice) *
          (1 + slippage)
        ).toString();
        const useAmount = parseUnits(maxUsdcAmount, Tokens.USDC.decimals);
        await approveToken({
          token: Tokens.USDC.address,
          spender: DEXON_ADDRESS,
          amount: useAmount,
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
        triggerPrice: parseUnits(triggerPrice, 18),
        slippage: parseUnits(slippage.toString(), 6),
        orderType: OrderTypeMapping[orderType],
        orderSide: OrderSideMapping[orderSide],
        deadline,
      };

      // Sign order with EIP-712
      const signature = await signTypedDataAsync({
        domain: {
          name: domain.name,
          version: domain.version,
          chainId: domain.chainId,
          verifyingContract: domain.verifyingContract,
        },
        types: DEXON_TYPED_DATA.Order.types,
        primaryType: DEXON_TYPED_DATA.Order.primaryType,
        message: order,
      });

      const { status } = await placeOrderApi({
        wallet: order.account,
        nonce: order.nonce.toString(),
        poolIds: findPoolIds(selectedToken.address, Tokens.USDC.address),
        side: orderSide,
        type: orderType,
        price: triggerPrice,
        amount: order.amount.toString(),
        paths: order.path,
        deadline: Number(order.deadline),
        slippage,
        signature,
      });

      if (status !== 200) {
        throw new Error("Failed to submit order");
      }

      toast.success(`${orderType} order placed successfully!`);
    } catch (_error) {
      toast.error("Failed to place order");
    } finally {
      setIsPending(false);
    }
  }, [
    address,
    amount,
    approveToken,
    orderSide,
    orderType,
    placeOrderApi,
    publicClient,
    selectedToken,
    signTypedDataAsync,
    triggerPrice,
  ]);

  return {
    placeOrder,
    isPending,
  };
};
