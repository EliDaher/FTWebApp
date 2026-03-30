
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BodyCardProps = {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"section">;

export default function BodyCard({ children, className = "", ...props }: BodyCardProps) {
  return (
    <section
      className={`glass-surface p-4 md:p-6 border border-white/20 shadow-[0_20px_50px_rgba(2,8,23,0.35)] ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
