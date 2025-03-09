import { parseOrderDetails, parseUnknownMessage } from "@/utils/order";
import { cn } from "@/utils/shadcn";
import { format } from "date-fns";
import { Bot } from "lucide-react";
import { type ReactNode, useCallback } from "react";
import { OrderPreview } from "./Preview";

export const UserMessage: IComponent<{ message: ChatMessage }> = ({
  message,
}) => (
  <div className="flex justify-end">
    <div
      className={
        "max-w-[80%] rounded-2xl bg-button px-4 py-2 font-medium text-gray-100"
      }
    >
      <p>{message.text}</p>
      <span className="mt-1 block text-xs opacity-70">
        {format(message.created_at * 1000, "HH:mm")}
      </span>
    </div>
  </div>
);

const BotMessage: IComponent<{ message: ChatMessage; isTyping?: boolean }> = ({
  message,
  isTyping,
}) => {
  const renderWrapper = useCallback(
    (children: ReactNode) => (
      <div className="relative px-10">
        <span
          className={cn(
            "absolute top-0 left-0 flex items-center gap-2 rounded-lg px-2 py-1 font-semibold text-white",
            {
              "origin-bottom animate-thinking rounded-lg p-[2px]": isTyping,
            },
          )}
        >
          <Bot className="h-6 w-6 text-current" />
        </span>
        <div className="min-w-[80%] text-white">{children}</div>
      </div>
    ),
    [isTyping],
  );

  const renderContent = () => {
    // Try to parse order details
    try {
      const orderDetails = parseOrderDetails(message.text);
      if (orderDetails) {
        return (
          <OrderPreview order={orderDetails} timestamp={message.created_at} />
        );
      }
    } catch (_e) {
      // cannot parse order details
    }

    const parsedMessage = parseUnknownMessage(message.text);
    return (
      <div
        className={cn("rounded-2xl px-4 py-2 font-medium", {
          "bg-purple4/40": parsedMessage.text,
        })}
      >
        {isTyping ? (
          <p className="animate-pulse">▊</p>
        ) : (
          <p>{parsedMessage.text}</p>
        )}
        <span className="mt-1 block text-xs opacity-70">
          {format(message.created_at * 1000, "HH:mm")}
        </span>
      </div>
    );
  };

  return renderWrapper(renderContent());
};

interface ChatMessagesProps {
  messages: ChatMessage[];
  typingMessage?: ChatMessage;
  newUserMessage?: ChatMessage;
}

export const ChatMessages: IComponent<ChatMessagesProps> = ({
  messages,
  newUserMessage,
  typingMessage,
}) => (
  <div className="space-y-4">
    {messages.map((message) =>
      message.role === "assistant" ? (
        <BotMessage key={`${message.created_at}-assistant`} message={message} />
      ) : (
        <UserMessage key={`${message.created_at}-user`} message={message} />
      ),
    )}
    {newUserMessage && (
      <UserMessage key="newUserMessage" message={newUserMessage} />
    )}
    {typingMessage && (
      <BotMessage key={"typingMessage"} message={typingMessage} isTyping />
    )}
  </div>
);
