"use client";

import { Button } from "@/components/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/Popover";
import { cn } from "@/utils/shadcn";
import { format } from "date-fns";

import { History, MessageSquare, Plus, Trash2, X } from "lucide-react";
import { BotAvatar } from "./BotAvatar";
import { ChatHistory } from "./ChatHistory";

export const ChatHeader: IComponent<{
  threads: Thread[];
  showHistory: boolean;
  currentThreadId?: string;
  handleNewChat: () => void;
  setShowHistory: (f: boolean) => void;
  handleSelectThread: (thread: Thread) => void;
  onClose?: () => void;
}> = ({
  currentThreadId,
  threads,
  showHistory,
  setShowHistory,
  handleSelectThread,
  handleNewChat,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between border-purple3 border-b bg-purple1 p-4 pl-6">
      <div className="flex items-center gap-3">
        <BotAvatar containerClassName="w-9 h-9" />
        <h2 className="flex items-center gap-2 text-center font-semibold text-lg">
          Zuni Assistant
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNewChat}
          className="hover:bg-purple4/20"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </Button>
        {threads.length > 0 && (
          <Popover
            open={showHistory}
            onOpenChange={setShowHistory}
            modal={true}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-purple4/20"
              >
                <History className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 overflow-y-auto border-purple3 bg-purple1 p-0"
              align="end"
              sideOffset={5}
            >
              <div className="border-purple3 border-b p-4">
                <Button
                  variant={"ghost"}
                  className="w-full justify-start gap-2 hover:bg-purple3/30"
                  onClick={() => {
                    handleNewChat();
                    setShowHistory(false);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
              <div className="mb-4 max-h-[500px] space-y-2 overflow-y-auto p-4">
                {threads.map((thread) => (
                  <ChatHistory
                    key={thread.thread_id}
                    thread={thread}
                    isSelected={thread.thread_id === currentThreadId}
                    onSelectThread={(thread) => {
                      handleSelectThread(thread);
                      setShowHistory(false);
                    }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-purple4/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};
