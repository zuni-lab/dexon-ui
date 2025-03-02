'use client';

import { UNISWAP_SWAP_ROUTER_ABI } from '@/abi/uniswapV3';
import { chatService } from '@/api/chat';
import { healthService } from '@/api/health';
import { DEXON_ADDRESS, UNISWAP_SWAP_ROUTER_ADDRESS } from '@/constants/contracts';
import { DEXON_TYPED_DATA, OrderTypeMapping } from '@/constants/orders';
import { Tokens } from '@/constants/tokens';
import { findPaths } from '@/utils/dex';
import { useQuery } from '@tanstack/react-query';
import { readContract, writeContract } from '@wagmi/core';
import { useCallback, useState } from 'react';
import { type Hex, erc20Abi, maxUint256, parseUnits } from 'viem';
import { monadTestnet } from 'viem/chains';
import { useAccount, useConfig, usePublicClient, useSignTypedData } from 'wagmi';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';

export const Health = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => healthService.health()
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {(() => {
        switch (data?.data) {
          case 'OK':
            return <div className='text-green-500'>ok</div>;
          default:
            return <div className='text-red-500'>error</div>;
        }
      })()}
    </div>
  );
};

const EXAMPLE_COMMANDS = [
  'Buy 1 ETH at market price',
  'Place a limit order to buy 2 ETH when price is below $2000',
  'Set a stop loss to sell 0.5 ETH if price drops below $2200',
  "What's my current ETH balance?",
  'Show my active orders',
  'Cancel all pending orders'
];

export const MainContent = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const config = useConfig();
  const { signTypedDataAsync } = useSignTypedData();

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

  const handleParseOrder = useCallback(
    async (order: OrderDetails) => {
      if (!address) {
        throw new Error('Please connect wallet');
      }

      const token = Tokens[order.token_name.toUpperCase() as TokenKey];
      if (!token) {
        throw new Error('Token not found');
      }

      const tokenIn = order.order_side === 'buy' ? Tokens.USDC : token;
      const tokenOut = order.order_side === 'buy' ? token : Tokens.USDC;
      const amount = parseUnits(order.amount, tokenIn.decimals);
      const path = findPaths(tokenIn.address, tokenOut.address);

      const allowance = await readContract(config, {
        abi: erc20Abi,
        address: tokenIn.address,
        functionName: 'allowance',
        args: [address, UNISWAP_SWAP_ROUTER_ADDRESS]
      });
      if (amount > allowance) {
        const approveTx = await writeContract(config, {
          address: tokenIn.address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [UNISWAP_SWAP_ROUTER_ADDRESS, amount]
        });
        await publicClient?.waitForTransactionReceipt({
          hash: approveTx
        });
      }

      if (order.trigger_condition === '=') {
        await handleSwap(address, tokenIn, tokenOut, path, amount);
      } else {
        // TODO: fetch current price and compare
        const currentPrice = parseUnits('2500', 18);
        const triggerPrice = parseUnits(order.trigger_price, 18);
        let orderType: number;
        if (
          (order.order_side === 'buy' && triggerPrice < currentPrice) ||
          (order.order_side === 'sell' && triggerPrice > currentPrice)
        ) {
          orderType = OrderTypeMapping.limit;
        } else {
          orderType = OrderTypeMapping.stop;
        }
        const orderSide = order.order_side === 'buy' ? 0 : 1;
        await handlePlaceOrder(address, path, amount, triggerPrice, orderType, orderSide);
      }
    },
    [address, config, publicClient]
  );

  const handleSwap = useCallback(
    async (account: Hex, tokenIn: Token, tokenOut: Token, path: Hex, amountIn: bigint) => {
      if (chainId !== monadTestnet.id) {
        throw new Error('Unsupported chain');
      }

      // swap logic
      const swapTx = await writeContract(config, {
        address: UNISWAP_SWAP_ROUTER_ADDRESS,
        abi: UNISWAP_SWAP_ROUTER_ABI,
        functionName: 'exactInput',
        args: [
          {
            amountIn: amountIn,
            recipient: account,
            amountOutMinimum: BigInt(0),
            path: path
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
    },
    [chainId, config, publicClient]
  );

  const handlePlaceOrder = useCallback(
    async (
      account: Hex,
      path: Hex,
      amountIn: bigint,
      triggerPrice: bigint,
      orderType: number,
      orderSide: number
    ) => {
      const nonce = BigInt(new Date().getTime());
      const slippage = BigInt(10000); // TODO get from user input, hardcoded 1%
      const deadline = maxUint256; // TODO get from user input

      if (!publicClient) {
        throw new Error('Public client not found');
      }
      const { domain } = await publicClient.getEip712Domain({
        address: DEXON_ADDRESS
      });
      const order = {
        account,
        nonce,
        path,
        amount: amountIn,
        triggerPrice,
        slippage,
        orderType,
        orderSide,
        deadline
      };
      const signature = await signTypedDataAsync({
        domain,
        types: DEXON_TYPED_DATA.Order.types,
        primaryType: DEXON_TYPED_DATA.Order.primaryType,
        message: order
      });

      setMessages((prev) => [
        ...prev,
        {
          text: 'Placed order successfully',
          isUser: false
        }
      ]);
    },
    [publicClient, signTypedDataAsync]
  );

  const handleExampleClick = (command: string) => {
    setInput(command);
  };

  return (
    <div className='flex-1 flex flex-col'>
      <ChatArea messages={messages} isLoading={isLoading} onParseOrder={handleParseOrder} />
      <InputArea input={input} setInput={setInput} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
