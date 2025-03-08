"use client";

import { Button } from "@/components/shadcn/Button";
import { ChatSidebar } from "./ChatSidebar";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/shadcn/Drawer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";

export const ChatInterface: IComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <Drawer
      open={isOpen}
      onClose={() => setIsOpen(false)}
      fixed
      direction="right"
      closeThreshold={0.5}
    >
      <DrawerTrigger asChild className="cursor-pointer">
        {isConnected ? (
          <Button
            variant={"ghost"}
            className="fixed right-6 bottom-6 h-12 w-12 cursor-pointer rounded-full border border-purple4/50 bg-purple4/20 p-[1px] shadow-lg hover:bg-purple4/30"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className="relative h-full w-full">
              <Image src="/bot.svg" alt="chat" fill />
            </div>
            <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border border-white bg-green-500" />
          </Button>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                variant={"ghost"}
                className="fixed right-6 bottom-6 h-12 w-12 cursor-pointer rounded-full border border-purple4/50 bg-purple4/20 p-[1px] shadow-lg hover:bg-purple4/30"
                onClick={openConnectModal}
              >
                <Wallet className="h-6 w-6" />
                <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border border-white bg-red-500" />
              </Button>
            )}
          </ConnectButton.Custom>
        )}
      </DrawerTrigger>
      <DrawerContent className="fixed top-0 right-0 left-[calc(100%-480px)] mt-0 h-screen items-end border-none">
        <DrawerTitle className="hidden" />
        <ChatSidebar
          className="h-full w-[480px]"
          onClose={() => setIsOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  );
};
