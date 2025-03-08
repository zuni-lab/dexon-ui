"use client";

import { chatService } from "@/api/chat";
import { cn } from "@/utils/shadcn";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { ChatHeader } from "./ChatHeader";
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
  const [currentThread, setCurrentThread] = useState<Partial<Thread>>();
  const queryClient = useQueryClient();
  const [showHistory, setShowHistory] = useState(false);

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
      await queryClient.invalidateQueries({
        queryKey: ["chat", "thread", thread.thread_id, address],
      });
    },
    [address, queryClient],
  );

  const clear = useCallback(() => {
    setShowHistory(false);
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
        <ChatHeader
          threads={threads}
          showHistory={showHistory}
          currentThreadId={currentThread?.thread_id}
          onClose={onClose}
          handleNewChat={handleNewChat}
          setShowHistory={setShowHistory}
          handleSelectThread={handleSelectThread}
        />

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
