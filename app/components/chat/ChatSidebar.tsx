"use client";

import { useMessageSending, useThreadDetails, useThreads } from "@/hooks/chat";
import { cn } from "@/utils/shadcn";
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

  const {
    threads,
    currentThread,
    setCurrentThread,
    showHistory,
    setShowHistory,
    handleSelectThread,
    handleNewChat,
  } = useThreads(address);

  const { typingMessage, newUserMessage, handleSendMessage, isMessaging } =
    useMessageSending(currentThread, address, setCurrentThread);

  const { messages, isLoadingDetails } = useThreadDetails(
    currentThread,
    address,
    isMessaging,
  );

  return (
    <>
      <div
        className={cn(
          "z-50 flex flex-col overflow-hidden rounded-2xl border border-purple3 bg-purple2",
          className,
        )}
      >
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
