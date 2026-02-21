"use client";

import { motion } from "framer-motion";

interface TapButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}

export function TapButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: TapButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7656] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010101] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "border border-[#a81123] bg-gradient-to-b from-[#c3182e] to-[#8d0f1d] text-white shadow-[0_8px_20px_rgba(168,17,35,0.25)] hover:from-[#d91f36] hover:to-[#a81123] hover:shadow-[0_12px_30px_rgba(168,17,35,0.4)]",
    outline:
      "border-2 border-[#8c7656] text-white hover:bg-[#8c7656]/20 hover:border-[#c9ad84]",
    ghost: "text-white hover:bg-white/10 hover:text-[#f7e4c4]",
  };

  const isFullWidth = className.includes("w-full");
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={isFullWidth ? "w-full" : "inline-block"}
    >
      <button
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  );
}
