import { Button } from "@/components/shadcn/Button";
import { Textarea } from "@/components/shadcn/Textarea";
import { cn } from "@/utils/shadcn";
import { Send } from "lucide-react";
import { useCallback } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  className?: string;
}

export const ChatInput: IComponent<ChatInputProps> = ({
  input,
  isLoading,
  onChange,
  onSubmit,
  className,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        const formEvent = new SubmitEvent("submit", {
          bubbles: true,
          cancelable: true,
        });
        onSubmit(formEvent as unknown as React.FormEvent);
      }
    },
    [onSubmit],
  );

  return (
    <div
      className={cn("border-purple3 border-t bg-purple1 px-4 py-6", className)}
    >
      <form onSubmit={onSubmit} className="relative">
        <Textarea
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isLoading ? "Processing..." : "Type your trading command..."
          }
          disabled={isLoading}
          className="max-h-16 resize-none rounded-xl border-purple3 bg-purple2 py-4 pr-12 text-white text-xl placeholder-white/50 focus:border-purple4 focus:outline-none focus:ring-0 "
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="-translate-y-1/2 absolute top-1/2 right-2 h-9 w-9 rounded-lg bg-purple4/20 p-2 text-white hover:bg-purple4/30"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};
