import { Button } from "@/components/shadcn/Button";
import { Input } from "@/components/shadcn/Input";
import { cn } from "@/utils/shadcn";
import { Send } from "lucide-react";

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
}) => (
  <div className={cn("border-purple3 border-t bg-purple1 p-6", className)}>
    <form onSubmit={onSubmit} className="relative">
      <Input
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          isLoading ? "Processing..." : "Type your trading command..."
        }
        disabled={isLoading}
        className="rounded-xl border-purple3 bg-purple2 py-6 pr-12 text-[17px] text-white placeholder-white/50"
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
