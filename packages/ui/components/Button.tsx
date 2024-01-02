"use client";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className="h-10 w-fit rounded-lg bg-white px-5 font-semibold text-black transition duration-300 hover:scale-110 active:opacity-80"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
