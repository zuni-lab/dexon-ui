"use client";

export const Footer: IComponent = () => {
  return (
    <footer className="flex h-8 justify-end">
      <span className="text-gray-400 text-sm">
        Copyright © 2025
        <a
          className="ml-1 cursor-pointer text-blue-400 hover:underline"
          target="_blank"
          href="https://github.com/zuni-lab"
          rel="noreferrer"
        >
          Zuni Laboratory
        </a>
      </span>
    </footer>
  );
};
