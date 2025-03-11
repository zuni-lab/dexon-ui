import { parseOrderDetails, parseUnknownMessage } from "@/utils/order";
import { cn } from "@/utils/shadcn";
import { format } from "date-fns";
import { type ReactNode, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BotAvatar } from "./BotAvatar";
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
          <BotAvatar containerClassName="w-6 h-6" />
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
        className={cn("rounded-2xl px-4 py-2", {
          "bg-purple4/40": parsedMessage.text,
        })}
      >
        {isTyping && parsedMessage.beAbleOrder ? (
          <p className="animate-pulse">▊</p>
        ) : parsedMessage.text ? (
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {parsedMessage.text}
            </ReactMarkdown>
          </div>
        ) : (
          <span className="rounded-full border border-red/60 p-1 px-2">
            Any error with this message
          </span>
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

const MarkdownComponents = {
  h1: ({ ...props }) => (
    <h1
      className="my-4 border-purple-400/30 border-b pb-2 font-bold text-2xl text-purple-300"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      className="my-3 border-purple-400/20 border-b pb-1 font-bold text-purple-200 text-xl"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3 className="my-2 font-bold text-lg text-purple-100" {...props} />
  ),
  h4: ({ ...props }) => (
    <h4 className="my-2 font-semibold text-base text-purple-100" {...props} />
  ),
  h5: ({ ...props }) => (
    <h5 className="my-1 font-semibold text-purple-100 text-sm" {...props} />
  ),
  h6: ({ ...props }) => (
    <h6 className="my-1 font-semibold text-purple-100 text-xs" {...props} />
  ),
  strong: ({ ...props }) => (
    <strong className="my-2 font-extrabold text-lg text-white" {...props} />
  ),
  p: ({ ...props }) => <p className="" {...props} />,
};
