import { Button } from "@/components/shadcn/Button";
import { cn } from "@/utils/shadcn";
import { format } from "date-fns";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

interface ChatHistoryProps {
  thread: Thread;
  isSelected: boolean;
  onSelectThread: (thread: Thread) => void;
}

export const ChatHistory = ({
  thread,
  isSelected,
  onSelectThread,
}: ChatHistoryProps) => (
  <div
    key={thread.thread_id}
    onClick={() => {
      onSelectThread(thread);
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        onSelectThread(thread);
      }
    }}
    className={cn(
      "group flex cursor-pointer items-center justify-start gap-3 rounded-lg p-3 hover:bg-purple3/30",
      {
        "border border-purple4": isSelected,
      },
    )}
  >
    <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-300" />
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium text-sm text-white">
        {thread.thread_name}
      </p>
      <p className="text-left text-gray-400 text-xs">
        {format(thread.updated_at * 1000, "MMM d, yyyy HH:mm")}
      </p>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 opacity-0 hover:text-red-400 group-hover:opacity-100"
      onClick={(e) => {
        e.stopPropagation();
        // handle delete
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);
