import { chatService } from "@/api/chat";
import { useQuery } from "@tanstack/react-query";

export function useThreadDetails(
  currentThread?: Partial<Thread>,
  address?: string,
  isMessaging = false,
) {
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
      !!currentThread && !!address && !!currentThread.thread_id && !isMessaging,
  });

  const messages = threadDetails?.messages || [];

  return {
    messages,
    isLoadingDetails,
  };
}
