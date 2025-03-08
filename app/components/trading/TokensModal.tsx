import { DialogTitle } from "@/components/shadcn/Dialog";

import { DialogContent } from "@/components/shadcn/Dialog";

import { TradeableTokensUI } from "@/constants/tokens";
import { ChevronDown } from "lucide-react";

import { DialogTrigger } from "@/components/shadcn/Dialog";

import { Dialog } from "@/components/shadcn/Dialog";
import { useState } from "react";

import { useSelectedToken } from "@/state/token";

import { Tokens } from "@/constants/tokens";
import { cn } from "@/utils/shadcn";

export const TokensModal: IComponent<{
  buttonClassName?: string;
}> = ({ buttonClassName }) => {
  const { token: selectedToken, setToken } = useSelectedToken();
  const [open, setOpen] = useState(false);
  const token = Tokens[selectedToken];
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild className="text-white">
        <button
          type="button"
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-xl bg-purple3 px-3 py-2 transition-colors hover:bg-purple2",
            buttonClassName,
          )}
        >
          {
            TradeableTokensUI[selectedToken as keyof typeof TradeableTokensUI]
              ?.icon
          }
          <span className="font-semibold text-white">{token.symbol}</span>
          <ChevronDown className="h-4 w-4 font-semibold text-gray-300" />
        </button>
      </DialogTrigger>
      <DialogContent className="-translate-x-1/2 fixed top-1/3 left-1/2 w-[400px] border-purple3 bg-purple1 p-4 [&>button]:text-white">
        <DialogTitle className="flex items-center justify-between font-semibold text-white text-xl">
          Select Token
        </DialogTitle>
        <div className="flex flex-col gap-2">
          {Object.entries(TradeableTokensUI).map(([token, { icon }]) => (
            <button
              type="button"
              key={token}
              onClick={() => {
                setToken(token as TradeableToken);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 border-transparent px-4 py-3 transition-all duration-150 hover:bg-purple2",
                {
                  "border-purple4 bg-purple2": selectedToken === token,
                },
              )}
            >
              {icon}
              <div className="flex flex-col items-start">
                <span className="font-semibold text-white">
                  {Tokens[token as keyof typeof Tokens].symbol}
                </span>
                <span className="text-gray-400 text-sm">
                  {Tokens[token as keyof typeof Tokens].name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
