"use client";

import { DEXON_ADDRESS } from "@/constants/contracts";
import {
  DEXON_TYPED_DATA,
  OrderSide,
  OrderTypeMapping,
} from "@/constants/orders";
import { Tokens } from "@/constants/tokens";
import { findPaths } from "@/utils/dex";
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

interface UsePlaceOrderProps {
  amount: string;
  orderSide: OrderSide;
  orderType: Exclude<OrderType, "market" | "twap">;
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
  const config = useConfig();
  const { signTypedDataAsync } = useSignTypedData();
  const { approveToken } = useApproveToken();

  const placeOrder = useCallback(async () => {
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
      const deadline = maxUint256;

      if (!publicClient) {
        throw new Error("Public client not found");
      }

      // Check and handle token approvals
      if (orderSide === OrderSide.BUY) {
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
        orderSide,
        deadline,
      };

      // Sign order with EIP-712
      const _signature = await signTypedDataAsync({
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

      // TODO: Send order to backend API
      // const response = await fetch('/api/orders', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //         order,
      //         signature,
      //     }),
      // });

      // if (!response.ok) {
      //     throw new Error('Failed to submit order');
      // }

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
    config,
    orderSide,
    orderType,
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
