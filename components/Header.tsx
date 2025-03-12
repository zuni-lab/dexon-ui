"use client";

import { Button } from "@/components/shadcn/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/Dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/Tooltip"; // Add these imports

import { FAUCET_ADDRESS } from "@/constants/contracts";
import Link from "next/link";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import ConnectWallet from "./ConnectWallet";
import { Faucet } from "./icons/Faucet";
import { LogoSvg } from "./icons/LogoSvg";
import { SettingIcon } from "./icons/Setting";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => setOpen(false),
    },
  });

  return (
    <header className="flex w-full items-center justify-between">
      <Link href="/">
        <LogoSvg />
      </Link>
      <div className="flex items-center gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="!p-0 h-12 w-12 rounded-full bg-primary pt-1 text-gray-100 text-lg hover:bg-primary/90"
              onClick={() => setOpen(true)}
            >
              <Faucet />
            </Button>
          </DialogTrigger>
          <DialogContent className="border-0 bg-secondary text-center sm:max-w-md">
            <DialogHeader>
              <DialogTitle>You will receive</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="font-medium">10 WBTC</div>
              <div className="font-medium">100 WETH</div>
              <div className="font-medium">1,000 WSOL</div>
              <div className="font-medium">1,000,000 USDC</div>
              <div>
                <Button
                  className="rounded-full bg-purple4/60 px-4 py-5 font-medium hover:bg-purple4/50"
                  onClick={() =>
                    writeContract({
                      abi: [
                        {
                          name: "faucet",
                          type: "function",
                        },
                      ],
                      address: FAUCET_ADDRESS,
                      functionName: "faucet",
                    })
                  }
                >
                  Faucet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* <TooltipProvider>
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
        </TooltipProvider> */}
        <ConnectWallet />
      </div>
    </header>
  );
}
