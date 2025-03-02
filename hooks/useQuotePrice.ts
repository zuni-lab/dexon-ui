'use client';

import { UNISWAP_QUOTER_V2_ABI } from '@/abi/uniswapV3';
import { UNISWAP_QUOTER_V2_ADDRESS } from '@/constants/contracts';
import { OrderSide } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { findPaths } from '@/utils/dex';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress } from 'viem';
import { usePublicClient } from 'wagmi';

interface UseQuotePriceProps {
  amount: string;
  orderSide: OrderSide;
  selectedToken: Token;
}

export const useQuotePrice = ({ amount, orderSide, selectedToken }: UseQuotePriceProps) => {
  const [priceRate, setPriceRate] = useState('0');
  const [usdcAmount, setUsdcAmount] = useState('0');
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        if (!publicClient) return;

        const path = findPaths(selectedToken.address, Tokens.USDC.address);

        // If amount is 0 or empty, calculate price for 1 unit of token
        if (!amount || amount === '0') {
          const swapAmount = parseUnits('1', selectedToken.decimals);
          const { result } = await publicClient.simulateContract({
            account: zeroAddress,
            address: UNISWAP_QUOTER_V2_ADDRESS,
            abi: UNISWAP_QUOTER_V2_ABI,
            functionName: orderSide === OrderSide.BUY ? 'quoteExactOutput' : 'quoteExactInput',
            args: [path, swapAmount]
          });
          const [estUsdcAmount] = result;

          setPriceRate(Number(formatUnits(estUsdcAmount, Tokens.USDC.decimals)).toFixed(2));
          setUsdcAmount('0');
          return;
        }

        // Calculate quote for actual amount
        const swapAmount = parseUnits(amount, selectedToken.decimals);
        const { result } = await publicClient.simulateContract({
          address: UNISWAP_QUOTER_V2_ADDRESS,
          abi: UNISWAP_QUOTER_V2_ABI,
          functionName: orderSide === OrderSide.BUY ? 'quoteExactOutput' : 'quoteExactInput',
          args: [path, swapAmount]
        });
        const [estUsdcAmount] = result;

        const formattedUsdcAmount = Number(formatUnits(estUsdcAmount, Tokens.USDC.decimals)).toFixed(2);
        setUsdcAmount(formattedUsdcAmount);

        // Calculate price rate (price per token)
        const rate = (Number(formatUnits(estUsdcAmount, Tokens.USDC.decimals)) / Number(amount)).toFixed(2);
        setPriceRate(rate);
      } catch (error) {
        setPriceRate('0');
        setUsdcAmount('0');
      }
    };

    fetchQuote();
  }, [amount, selectedToken, orderSide, publicClient]);

  return {
    priceRate,
    usdcAmount
  };
};
