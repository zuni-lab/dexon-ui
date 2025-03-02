'use client';

import { DEXON_ADDRESS } from '@/constants/contracts';
import { DEXON_TYPED_DATA, type OrderSide, type OrderType } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { findPaths } from '@/utils/dex';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { maxUint256, parseUnits } from 'viem';
import { useAccount, usePublicClient, useSignTypedData } from 'wagmi';

interface UsePlaceOrderProps {
  amount: string;
  orderSide: OrderSide;
  orderType: OrderType;
  selectedToken: Token;
  triggerPrice: string;
}

export const usePlaceOrder = ({
  amount,
  orderSide,
  orderType,
  selectedToken,
  triggerPrice
}: UsePlaceOrderProps) => {
  const [isPending, setIsPending] = useState(false);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { signTypedDataAsync } = useSignTypedData();

  const placeOrder = useCallback(async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!amount || Number(amount) === 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!triggerPrice || Number(triggerPrice) === 0) {
      toast.error('Please enter a valid trigger price');
      return;
    }

    try {
      setIsPending(true);

      // Generate nonce using timestamp
      const nonce = BigInt(new Date().getTime());

      // Get path for token swap
      const path = findPaths(selectedToken.address, Tokens.USDC.address);

      // TODO: Make these configurable in UI
      const slippage = BigInt(10000); // 1%
      const deadline = maxUint256;

      if (!publicClient) {
        throw new Error('Public client not found');
      }

      // Get EIP-712 domain
      const { domain } = await publicClient.getEip712Domain({
        address: DEXON_ADDRESS
      });

      // Prepare order data
      const order = {
        account: address,
        nonce,
        path,
        amount: parseUnits(amount, selectedToken.decimals),
        triggerPrice: parseUnits(triggerPrice, 18),
        slippage,
        orderType,
        orderSide,
        deadline
      };

      // Sign order with EIP-712
      const signature = await signTypedDataAsync({
        domain,
        types: DEXON_TYPED_DATA.Order.types,
        primaryType: DEXON_TYPED_DATA.Order.primaryType,
        message: order
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

      // TODO: Reset form or update UI as needed
      // setAmount('0');
      // setTriggerPrice('0');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsPending(false);
    }
  }, [address, amount, orderSide, orderType, publicClient, selectedToken, signTypedDataAsync, triggerPrice]);

  return {
    placeOrder,
    isPending
  };
};
