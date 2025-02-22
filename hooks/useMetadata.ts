import { RouterMeta } from '@/constants/router';

import type { RouterKey } from '@/constants/router';

import { AppRouter } from '@/constants/router';
import { usePathname } from 'next/navigation';

/**
 * Get current router meta
 */
export const useCurrentRouterMeta = () => {
  const pathname = usePathname()?.slice(3);
  const currentRouterKey =
    (Object.keys(AppRouter).find((key) => AppRouter[key as RouterKey] === pathname) as RouterKey) ?? 'Home';
  const currentRouterMeta = RouterMeta[currentRouterKey];
  if (currentRouterMeta && currentRouterMeta.icon === null) {
    currentRouterMeta.icon = '/favicon.ico';
  }

  return { ...currentRouterMeta, key: currentRouterKey };
};
