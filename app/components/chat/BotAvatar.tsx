import Image from "next/image";

export const BotAvatar: IComponent<{
  containerClassName?: string;
}> = ({ containerClassName }) => {
  const content = (
    <div className="relative h-full w-full">
      <Image src="/bot.svg" alt="chat" fill />
    </div>
  );
  return containerClassName ? (
    <div className={containerClassName}>{content}</div>
  ) : (
    content
  );
};
