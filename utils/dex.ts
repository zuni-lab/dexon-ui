import { UNISWAP_V3_POOLS } from '@/constants/contracts';
import { type Hex, encodePacked } from 'viem';

function isTokenInPool(pool: Pool, token: Hex): boolean {
  return pool.token0.address === token || pool.token1.address === token;
}

function getOtherToken(pool: Pool, token: Hex): Hex {
  return pool.token0.address === token ? pool.token1.address : pool.token0.address;
}

export function findPaths(tokenIn: Hex, tokenOut: Hex, maxHops = 2): Hex {
  let paths: Hex = '0x';

  function findPathRecursive(poolPaths: Pool[], tokenPaths: Hex[], currentToken: Hex, depth: number) {
    if (currentToken === tokenOut && poolPaths.length > 0) {
      for (let i = 0; i < poolPaths.length; i++) {
        paths = encodePacked(['bytes', 'uint24', 'address'], [paths, poolPaths[i].fee, tokenPaths[i]]);
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
    (pool) => pool.token0.address === tokenIn || pool.token1.address === tokenIn
  );

  if (!startPool) {
    return paths;
  }

  const startToken =
    startPool.token0.address === tokenIn ? startPool.token0.address : startPool.token1.address;

  paths = startToken;
  findPathRecursive([], [], tokenIn, 0);

  return paths;
}
