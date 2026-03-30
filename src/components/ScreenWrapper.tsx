import { motion, useReducedMotion } from "framer-motion";
import { useMemo, type ReactNode } from "react";

type ScreenWrapperProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function ScreenWrapper({ title, children, className = "" }: ScreenWrapperProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden px-4 pb-10 pt-24 md:px-6 lg:px-8 ${className}`}>
      <BackgroundBubbles />

      <div className="page-section relative z-10 fade-in-up text-white">
        {title ? (
          <h2 className="mb-6 text-center font-Orbitron text-3xl font-black tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

function BackgroundBubbles() {
  const shouldReduceMotion = useReducedMotion();

  const bubbles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 120 + Math.random() * 240,
        opacity: 0.12 + Math.random() * 0.12,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 1.8,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.14),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.14),transparent_45%)]" />

      {bubbles.map((bubble) => (
        <motion.span
          key={bubble.id}
          className="absolute rounded-full bg-yellow-300/25 blur-3xl"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            opacity: bubble.opacity,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -12, 0, 12, 0],
                  x: [0, 8, 0, -8, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: bubble.duration,
                  ease: "easeInOut",
                  delay: bubble.delay,
                }
          }
        />
      ))}
    </div>
  );
}
