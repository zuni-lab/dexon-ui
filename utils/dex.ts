import { UNISWAP_V3_POOLS } from "@/constants/contracts";
import { Tokens } from "@/constants/tokens";
import { type Hex, encodePacked, formatUnits } from "viem";

function isTokenInPool(pool: Pool, token: Hex): boolean {
  return pool.token0.address === token || pool.token1.address === token;
}

function getOtherToken(pool: Pool, token: Hex): Hex {
  return pool.token0.address === token
    ? pool.token1.address
    : pool.token0.address;
}

export function findPaths(tokenIn: Hex, tokenOut: Hex, maxHops = 2): Hex {
  let paths: Hex = "0x";

  function findPathRecursive(
    poolPaths: Pool[],
    tokenPaths: Hex[],
    currentToken: Hex,
    depth: number,
  ) {
    if (currentToken === tokenOut && poolPaths.length > 0) {
      paths = tokenIn;
      for (let i = 0; i < poolPaths.length; i++) {
        paths = encodePacked(
          ["bytes", "uint24", "address"],
          [paths, poolPaths[i].fee, tokenPaths[i]],
        );
      }
      return;
    }

    if (depth >= maxHops) {
      return;
    }

    for (const pool of UNISWAP_V3_POOLS) {
      if (poolPaths.includes(pool)) {
        continue;
      }

      if (isTokenInPool(pool, currentToken)) {
        const nextToken = getOtherToken(pool, currentToken);

        poolPaths.push(pool);
        tokenPaths.push(nextToken);
        findPathRecursive(poolPaths, tokenPaths, nextToken, depth + 1);
        poolPaths.pop();
        tokenPaths.pop();
      }
    }
  }

  const startPool = UNISWAP_V3_POOLS.find(
    (pool) =>
      pool.token0.address === tokenIn || pool.token1.address === tokenIn,
  );

  if (!startPool) {
    return paths;
  }

  paths = tokenIn;
  findPathRecursive([], [], tokenIn, 0);

  return paths;
}

export function findPoolIds(tokenIn: Hex, tokenOut: Hex): Hex[] {
  return UNISWAP_V3_POOLS.filter((pool) => {
    return (
      (pool.token0.address.toLowerCase() === tokenIn.toLowerCase() &&
        pool.token1.address.toLowerCase() === tokenOut.toLowerCase()) ||
      (pool.token0.address.toLowerCase() === tokenOut.toLowerCase() &&
        pool.token1.address.toLowerCase() === tokenIn.toLowerCase())
    );
  }).map((pool) => pool.address);
}

export function getTokenPairFromPath(path: Hex): string {
  const addressSize = 40;
  const firstToken = path.slice(0, addressSize + 2);
  const lastToken = `0x${path.slice(-addressSize)}`;

  const quoteToken = Tokens.USDC;
  const baseTokenAddress =
    firstToken === quoteToken.address ? lastToken : firstToken;
  const baseToken = Object.values(Tokens).find(
    (token) => token.address === baseTokenAddress,
  );
  if (!baseToken) {
    throw new Error("Token not found");
  }

  return `${baseToken.symbol}/${quoteToken.symbol}`;
}

export function formatAmountWithPath(path: Hex, amount: bigint): string {
  const firstToken = path.slice(0, 42);
  const token = Object.values(Tokens).find(
    (token) => token.address === firstToken,
  );
  if (!token) {
    throw new Error("Token not found");
  }

  return formatUnits(amount, token.decimals);
}
