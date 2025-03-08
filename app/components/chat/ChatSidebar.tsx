"use client";

import { chatService } from "@/api/chat";
import { Button } from "@/components/shadcn/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/Popover";
import { cn } from "@/utils/shadcn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import {
  ChevronLeft,
  History,
  MessageSquare,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { ThreadDetails } from "./ThreadDetails";

interface ChatSidebarProps {
  className?: string;
  onClose?: () => void;
}

export const ChatSidebar: IComponent<ChatSidebarProps> = ({
  onClose,
  className,
}) => {
  const { address } = useAccount();
  const [showHistory, setShowHistory] = useState(false);
  const [currentThread, setCurrentThread] = useState<Partial<Thread>>();
  const queryClient = useQueryClient();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [typingMessage, setTypingMessage] = useState<ChatMessage>();
  const [newUserMessage, setNewUserMessage] = useState<ChatMessage>();

  // Query for threads list
  const { data: threadsResponse } = useQuery({
    queryKey: ["chat", "threads", address],
    queryFn: () =>
      chatService.listThreads({
        user_address: address!,
        offset: 0,
        limit: 10,
      }),
    enabled: !!address,
  });

  // Query for current thread details
  const { data: threadDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["chat", "thread", currentThread?.thread_id, address],
    queryFn: () => {
      if (!currentThread || !address) return null;
      return chatService.getThreadDetails({
        thread_id: currentThread.thread_id!,
        user_address: address,
      });
    },
    enabled:
      !!currentThread &&
      !!address &&
      !!currentThread.thread_id &&
      !typingMessage &&
      !newUserMessage,
  });

  const threads = threadsResponse?.data || [];
  const messages = threadDetails?.messages || [];

  // Load latest thread on initial load
  // useEffect(() => {
  //   if (threads.length > 0 && !currentThread) {
  //     setCurrentThread(threads[0]);
  //   }
  // }, [threads]);

  const handleSelectThread = useCallback(
    async (thread: Thread) => {
      setCurrentThread(thread);
      setShowHistory(false);
      await queryClient.invalidateQueries({
        queryKey: ["chat", "thread", thread.thread_id, address],
      });
    },
    [address, queryClient],
  );

  const clear = useCallback(() => {
    setIsHistoryOpen(false);
    setTypingMessage(undefined);
    setNewUserMessage(undefined);
  }, []);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!address) return;

      const userMessage: ChatMessage = {
        role: "user",
        text: message,
        created_at: Date.now() / 1000,
      };

      const baseMessage = {
        role: "assistant" as ChatRole,
        created_at: Date.now() / 1000,
      };

      const tempBotMessage: ChatMessage = {
        ...baseMessage,
        text: "▊",
      };

      setNewUserMessage(userMessage);
      setTypingMessage(tempBotMessage);

      try {
        const stream = await chatService.sendMessage({
          message,
          threadId: currentThread?.thread_id,
          userAddress: address,
        });

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let currentMessage = "";
        let newThreadRef: Partial<Thread> | undefined;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              const eventType = line.slice(7).trim();
              const dataLine = lines[lines.indexOf(line) + 1];

              if (dataLine?.startsWith("data: ")) {
                const data = dataLine.slice(6);
                switch (eventType) {
                  case "thread":
                    try {
                      const threadData = JSON.parse(data);
                      if (!currentThread) {
                        newThreadRef = {
                          user_address: address,
                          thread_id: threadData.thread_id,
                          thread_name: message,
                          updated_at: Date.now() / 1000,
                        };
                      }
                    } catch (_e) {
                      // handle error
                    }
                    break;

                  case "message":
                    currentMessage += data;
                    setTypingMessage({
                      ...baseMessage,
                      text: currentMessage,
                    });
                    break;

                  case "done":
                    try {
                      const statusData = JSON.parse(data);
                      if (statusData.status === "completed") {
                        // Update the final message
                        setTypingMessage(undefined);
                      } else {
                        toast.error(statusData.message);
                      }
                    } catch (_e) {
                      // handle error
                    }
                    break;
                }
              }
            }
          }
        }

        // After the stream is done, update the thread with latest data
        if (newThreadRef) {
          setCurrentThread(newThreadRef);
          // Update thread details cache directly
          queryClient.setQueryData(
            ["chat", "thread", newThreadRef?.thread_id, address],
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (old: any) => ({
              ...old,
              messages: [
                ...(old?.messages || []),
                {
                  ...userMessage,
                },
                {
                  ...baseMessage,
                  text: currentMessage,
                },
              ],
            }),
          );
        }
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        console.error(error);
        try {
          toast.error(JSON.parse(error.response.data).message);
        } catch (_e) {
          toast.error(error.message);
        }
      } finally {
        clear();
        queryClient.invalidateQueries({
          queryKey: ["chat", "threads", address],
        });
      }
    },
    [currentThread, address, queryClient, clear],
  );

  const handleNewChat = useCallback(() => {
    setCurrentThread(undefined);
    clear();
    // Clear messages for new chat
    queryClient.setQueryData(
      ["chat", "thread", currentThread?.thread_id, address],
      null,
    );
  }, [currentThread?.thread_id, address, queryClient, clear]);

  return (
    <>
      <div
        className={cn(
          "z-50 flex w-96 flex-col overflow-hidden rounded-l-xl border-purple3 border-l bg-purple2",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-purple3 border-b bg-purple1 px-4 py-3">
          <div className="flex items-center gap-2">
            {showHistory && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
                className="text-gray-300 hover:bg-purple4/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="flex items-center gap-2 text-center font-semibold text-gray-200">
              Zuni Assistant
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              className="text-gray-300 hover:bg-purple4/20"
            >
              <Plus className="h-5 w-5" />
            </Button>
            {!showHistory && threads.length > 0 && (
              <Popover
                open={isHistoryOpen}
                onOpenChange={setIsHistoryOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:bg-purple4/20"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 overflow-y-auto border-purple3 bg-purple1 p-0 text-white"
                  align="end"
                  sideOffset={5}
                >
                  <div className="border-purple3 border-b p-4">
                    <Button
                      variant={"ghost"}
                      className="w-full justify-start gap-2 text-gray-300 hover:bg-purple3/30"
                      onClick={() => {
                        handleNewChat();
                        setIsHistoryOpen(false);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      New Chat
                    </Button>
                  </div>
                  <div className="mb-4 max-h-[500px] space-y-2 overflow-y-auto p-4">
                    {threads.map((thread) => (
                      <div
                        key={thread.thread_id}
                        onClick={() => {
                          handleSelectThread(thread);
                          setIsHistoryOpen(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSelectThread(thread);
                            setIsHistoryOpen(false);
                          }
                        }}
                        className={cn(
                          "group flex cursor-pointer items-center justify-start gap-3 rounded-lg p-3 hover:bg-purple3/30",
                          {
                            "border border-purple4":
                              currentThread?.thread_id === thread.thread_id,
                          },
                        )}
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-300" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-sm text-white">
                            {thread.thread_name}
                          </p>
                          <p className="text-left text-gray-400 text-xs">
                            {format(
                              thread.updated_at * 1000,
                              "MMM d, yyyy HH:mm",
                            )}
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
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-purple4/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <ThreadDetails
          thread={currentThread}
          messages={messages}
          isLoading={isLoadingDetails}
          onSendMessage={handleSendMessage}
          typingMessage={typingMessage}
          newUserMessage={newUserMessage}
        />
      </div>
    </>
  );
};
