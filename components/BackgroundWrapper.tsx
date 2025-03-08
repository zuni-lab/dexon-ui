"use client";

import Image from "next/image";

export const BackgroundWrapper: IComponent<{
  url?: string;
}> = ({ url = "/background.svg" }) => {
  return (
    <div className="-z-10 fixed inset-x-0 bottom-0 h-screen">
      <Image
        src={url}
        alt="Background"
        fill
        priority
        className="object-cover"
        quality={100}
      />
    </div>
  );
};

export default BackgroundWrapper;
