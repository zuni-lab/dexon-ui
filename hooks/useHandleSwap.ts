'use client';

import { UNISWAP_SWAP_ROUTER_ABI } from '@/abi/uniswapV3';
import { UNISWAP_SWAP_ROUTER_ADDRESS } from '@/constants/contracts';
import { OrderSide } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { findPaths } from '@/utils/dex';
import { readContract, writeContract } from '@wagmi/core';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { erc20Abi, maxUint256, parseUnits } from 'viem';
import { useAccount, useConfig, usePublicClient } from 'wagmi';

interface UseHandleSwapProps {
  amount: string;
  orderSide: OrderSide;
  selectedToken: Token;
  usdcAmount: string;
}

export const useHandleSwap = ({ amount, orderSide, selectedToken, usdcAmount }: UseHandleSwapProps) => {
  const [isPending, setIsPending] = useState(false);
  const { address } = useAccount();
  const config = useConfig();
  const publicClient = usePublicClient();

  const handleSwap = useCallback(async () => {
    if (!address || !publicClient) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!amount || Number(amount) === 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsPending(true);

      // Check and handle token approvals
      let approveTx: `0x${string}` | undefined;
      if (orderSide === OrderSide.BUY) {
        const allowance = await readContract(config, {
          abi: erc20Abi,
          address: Tokens.USDC.address,
          functionName: 'allowance',
          args: [address, UNISWAP_SWAP_ROUTER_ADDRESS]
        });
        const useAmount = parseUnits(usdcAmount, Tokens.USDC.decimals);
        if (allowance < (useAmount * BigInt(110)) / BigInt(100)) {
          approveTx = await writeContract(config, {
            abi: erc20Abi,
            address: Tokens.USDC.address,
            functionName: 'approve',
            args: [UNISWAP_SWAP_ROUTER_ADDRESS, maxUint256]
          });
        }
      } else {
        const allowance = await readContract(config, {
          abi: erc20Abi,
          address: selectedToken.address,
          functionName: 'allowance',
          args: [address, UNISWAP_SWAP_ROUTER_ADDRESS]
        });
        const useAmount = parseUnits(amount, selectedToken.decimals);
        if (allowance < useAmount) {
          approveTx = await writeContract(config, {
            abi: erc20Abi,
            address: selectedToken.address,
            functionName: 'approve',
            args: [UNISWAP_SWAP_ROUTER_ADDRESS, maxUint256]
          });
        }
      }

      // Wait for approval transaction if needed
      if (approveTx) {
        await publicClient.waitForTransactionReceipt({
          hash: approveTx
        });
        toast.success('Token approval confirmed');
      }

      // Execute swap
      const path = findPaths(selectedToken.address, Tokens.USDC.address);
      const swapToken = orderSide === OrderSide.BUY ? Tokens.USDC : selectedToken;
      const swapAmount = parseUnits(amount, swapToken.decimals);

      let swapTx: `0x${string}`;
      if (orderSide === OrderSide.BUY) {
        swapTx = await writeContract(config, {
          address: UNISWAP_SWAP_ROUTER_ADDRESS,
          abi: UNISWAP_SWAP_ROUTER_ABI,
          functionName: 'exactOutput',
          args: [
            {
              path,
              amountOut: swapAmount,
              recipient: address,
              amountInMaximum: maxUint256
            }
          ]
        });
      } else {
        swapTx = await writeContract(config, {
          address: UNISWAP_SWAP_ROUTER_ADDRESS,
          abi: UNISWAP_SWAP_ROUTER_ABI,
          functionName: 'exactInput',
          args: [
            {
              path,
              amountIn: swapAmount,
              recipient: address,
              amountOutMinimum: BigInt(0)
            }
          ]
        });
      }

      // Wait for swap transaction
      await publicClient.waitForTransactionReceipt({
        hash: swapTx
      });

      toast.success('Swap executed successfully!');
      setIsPending(false);
    } catch (error) {
      toast.error('Failed to execute swap');
      setIsPending(false);
    }
  }, [address, amount, config, orderSide, publicClient, selectedToken, usdcAmount]);

  return {
    handleSwap,
    isPending
  };
};
