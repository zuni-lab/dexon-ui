'use client';

import { UNISWAP_SWAP_ROUTER_ABI } from '@/abi/uniswapV3';
import { chatService } from '@/api/chat';
import { UNISWAP_SWAP_ROUTER_ADDRESS } from '@/constants/contracts';
import { Tokens } from '@/constants/tokens';
import { findPaths } from '@/utils/dex';
import { readContract, writeContract } from '@wagmi/core';
import { useState } from 'react';
import { erc20Abi, parseUnits } from 'viem';
import { useAccount, useConfig, usePublicClient } from 'wagmi';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';

export const MainContent = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const config = useConfig();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await chatService.sendMessage({
        message: input,
        threadId: threadId || undefined
      });

      let currentMessage = '';
      setMessages((prev) => [...prev, { text: '▊', isUser: false }]);

      // Split the response text into lines and process each event
      const lines = response.data.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Handle event type
        if (line.startsWith('event: ')) {
          const eventType = line.slice(7);
          // Get corresponding data line
          const dataLine = lines[i + 1];
          if (dataLine?.startsWith('data: ')) {
            const data = dataLine.slice(6);

            switch (eventType) {
              case 'thread':
                try {
                  const threadData = JSON.parse(data);
                  setThreadId(threadData.thread_id);
                  if (threadData.thread_id) {
                    window.history.pushState({}, '', `/chat/${threadData.thread_id}`);
                  }
                } catch (e) {}
                break;

              case 'message':
                await new Promise((resolve) => setTimeout(resolve, 50)); // Delay for typing effect
                currentMessage += data;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].text = `${currentMessage}▊`;
                  return newMessages;
                });
                break;

              case 'done':
                try {
                  const statusData = JSON.parse(data);
                  if (statusData.status === 'completed') {
                    setIsLoading(false);
                  }
                } catch (e) {}
                break;
            }
          }
          // Skip the data line since we've already processed it
          i++;
        }
      }

      // Remove cursor from final message
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = currentMessage;
        return newMessages;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Error: Failed to get response',
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleParseOrder = async (order: OrderDetails) => {
    if (order.trigger_condition === '=') {
      const token = Tokens[order.token_name.toUpperCase() as TokenKey];
      if (!token) {
        throw new Error('Token not found');
      }

      const tokenIn = order.order_side === 'buy' ? Tokens.USDC : token;
      const tokenOut = order.order_side === 'buy' ? token : Tokens.USDC;
      const amountIn = order.amount;
      await handleSwap(tokenIn, tokenOut, amountIn);
    } else {
    }
  };

  const handleSwap = async (tokenIn: Token, tokenOut: Token, amountIn: string) => {
    if (!address) {
      throw new Error('Please connect wallet');
    }

    if (chainId !== 10143) {
      throw new Error('Unsupported chain');
    }

    const allowance = await readContract(config, {
      abi: erc20Abi,
      address: tokenIn.address,
      functionName: 'allowance',
      args: [address, UNISWAP_SWAP_ROUTER_ADDRESS]
    });

    const rawAmountIn = parseUnits(amountIn, tokenIn.decimals);
    if (rawAmountIn > allowance) {
      const approveTx = await writeContract(config, {
        address: tokenIn.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [UNISWAP_SWAP_ROUTER_ADDRESS, rawAmountIn]
      });
      await publicClient?.waitForTransactionReceipt({
        hash: approveTx
      });
    }

    // swap logic
    const swapTx = await writeContract(config, {
      address: UNISWAP_SWAP_ROUTER_ADDRESS,
      abi: UNISWAP_SWAP_ROUTER_ABI,
      functionName: 'exactInput',
      args: [
        {
          amountIn: rawAmountIn,
          recipient: address,
          amountOutMinimum: BigInt(0),
          path: findPaths(tokenIn.address, tokenOut.address)
        }
      ]
    });
    await publicClient?.waitForTransactionReceipt({
      hash: swapTx
    });

    setMessages((prev) => [
      ...prev,
      {
        text: `Swapped ${amountIn} ${tokenIn.symbol} for ${tokenOut.symbol}`,
        isUser: false
      }
    ]);
  };

  return (
    <div className='flex-1 flex flex-col'>
      <ChatArea messages={messages} isLoading={isLoading} onParseOrder={handleParseOrder} />
      <InputArea input={input} setInput={setInput} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
