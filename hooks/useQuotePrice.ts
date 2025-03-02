'use client';

import { UNISWAP_QUOTER_V2_ABI } from '@/abi/uniswapV3';
import { UNISWAP_QUOTER_V2_ADDRESS } from '@/constants/contracts';
import { OrderSide } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { findPaths } from '@/utils/dex';
import { simulateContract } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useConfig, useConnectorClient } from 'wagmi';

interface UseQuotePriceProps {
  amount: string;
  orderSide: OrderSide;
  selectedToken: Token;
}

export const useQuotePrice = ({ amount, orderSide, selectedToken }: UseQuotePriceProps) => {
  const [priceRate, setPriceRate] = useState('0');
  const [usdcAmount, setUsdcAmount] = useState('0');
  const connector = useConnectorClient();
  const config = useConfig();

  useEffect(() => {
    if (!connector.data) return;

    const fetchQuote = async () => {
      try {
        const path = findPaths(selectedToken.address, Tokens.USDC.address);

        // If amount is 0 or empty, calculate price for 1 unit of token
        if (!amount || amount === '0') {
          const swapAmount = parseUnits('1', selectedToken.decimals);
          const { result } = await simulateContract(config, {
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
        const { result } = await simulateContract(config, {
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
  }, [connector.data, amount, selectedToken, orderSide, config]);

  return {
    priceRate,
    usdcAmount
  };
};
