import { Button } from "@/components/shadcn/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/Tooltip"; // Add these imports

import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import { LogoSvg } from "./icons/LogoSvg";
import { SettingIcon } from "./icons/Setting";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between">
      <Link href="/">
        <LogoSvg />
      </Link>
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
              >
                <SettingIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="z-50 w-xl border border-purple4 bg-purple2 p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Keyboard Shortcuts</h3>
                <div className="grid gap-2 font-medium text-sm">
                  <div className="flex items-center justify-between">
                    <span>Open AI</span>
                    <kbd className="rounded bg-purple2 px-2 py-1">⌘ + K</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>New Chat</span>
                    <kbd className="rounded bg-purple2 px-2 py-1">⌘ + I</kbd>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ConnectWallet />
      </div>
    </header>
  );
}
