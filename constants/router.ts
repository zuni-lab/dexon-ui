import { usePathname } from "next/navigation";

export const AppRouter = {
  Home: "/",
};

export type RouterKey = keyof typeof AppRouter;

export const RouterMeta: Record<
  RouterKey,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  { title: string; description?: string; icon: any }
> = {
  Home: { title: "Home", description: "HOME", icon: null },
};
