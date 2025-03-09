import { chatService } from "@/api/chat";
import { cleanupJsonString } from "@/utils/order";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useMessageSending(
  currentThread?: Partial<Thread>,
  address?: string,
  setCurrentThread?: (thread: Partial<Thread>) => void,
) {
  const [typingMessage, setTypingMessage] = useState<ChatMessage>();
  const [newUserMessage, setNewUserMessage] = useState<ChatMessage>();
  const queryClient = useQueryClient();

  const clear = useCallback(() => {
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

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("event: ")) {
              const eventType = line.slice(7).trim();
              if (i + 1 < lines.length && lines[i + 1]?.startsWith("data: ")) {
                const dataLine = lines[i + 1];
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
                    } catch (e) {
                      console.error("Error parsing thread data:", e);
                    }
                    break;

                  case "message":
                    currentMessage += data;
                    try {
                      JSON.parse(currentMessage);
                    } catch (_e) {
                      console.debug("Still collecting message parts...");
                    }

                    setTypingMessage({
                      ...baseMessage,
                      text: currentMessage,
                    });
                    break;

                  case "done":
                    try {
                      const statusData = JSON.parse(data);
                      if (statusData.status === "completed") {
                        try {
                          const cleanedMessage =
                            cleanupJsonString(currentMessage);
                          const parsedMessage = JSON.parse(cleanedMessage);
                          currentMessage = JSON.stringify(parsedMessage);
                        } catch (jsonError) {
                          console.error(
                            "Error fixing JSON message:",
                            jsonError,
                          );
                        }

                        setTypingMessage(undefined);
                      } else {
                        toast.error(statusData.message);
                      }
                    } catch (e) {
                      console.error("Error processing done event:", e);
                    }
                    break;
                }
              }
            }
          }
        }

        // After the stream is done, update the thread with latest data
        if (newThreadRef && setCurrentThread) {
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
    [currentThread, address, queryClient, clear, setCurrentThread],
  );

  return {
    typingMessage,
    newUserMessage,
    handleSendMessage,
    clear,
    isMessaging: !!typingMessage || !!newUserMessage,
  };
}
