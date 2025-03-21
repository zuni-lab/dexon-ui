import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/Tooltip";
import { useCallback, useState } from "react";

export const CopyToClipboard: IComponent<{
  text: string;
}> = ({ text, children }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [text]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          <div
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              copyToClipboard();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.stopPropagation();
                event.preventDefault();
                copyToClipboard();
              }
            }}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>{copied ? "Copied!" : `Copy: ${text}`} </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
