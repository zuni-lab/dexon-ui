import { chatService } from "@/api/chat";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useThreads(address?: string) {
  const [currentThread, setCurrentThread] = useState<Partial<Thread>>();
  const [showHistory, setShowHistory] = useState(false);
  const queryClient = useQueryClient();

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

  const threads = threadsResponse?.data || [];

  const handleSelectThread = useCallback(
    async (thread: Thread) => {
      setCurrentThread(thread);
      await queryClient.invalidateQueries({
        queryKey: ["chat", "thread", thread.thread_id, address],
      });
    },
    [address, queryClient],
  );

  const handleNewChat = useCallback(() => {
    setCurrentThread(undefined);
    setShowHistory(false);

    // Clear messages for new chat
    if (currentThread?.thread_id) {
      queryClient.setQueryData(
        ["chat", "thread", currentThread.thread_id, address],
        null,
      );
    }
  }, [currentThread?.thread_id, address, queryClient]);

  return {
    threads,
    currentThread,
    setCurrentThread,
    showHistory,
    setShowHistory,
    handleSelectThread,
    handleNewChat,
  };
}
