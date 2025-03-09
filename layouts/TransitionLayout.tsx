"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const TransitionLayout: IComponent<{ id?: string }> = ({
  children,
  id,
}) => {
  const pathname = usePathname();

  const simplePathname = id ?? pathname?.split("/")[0];

  return (
    <motion.div
      key={simplePathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="z-0 h-full w-full"
    >
      {children}
    </motion.div>
  );
};
