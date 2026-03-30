
import type { ReactNode } from "react";

type HeaderCardProps = {
  children: ReactNode;
  className?: string;
};

export default function HeaderCard({ children, className = "" }: HeaderCardProps) {
  return (
    <header
      className={`glass-surface-strong mb-5 mt-2 px-4 py-3 md:px-5 md:py-4 ${className}`}
    >
      {children}
    </header>
  );
}
