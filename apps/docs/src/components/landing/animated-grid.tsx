"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import React from "react";

interface AnimatedGridProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedGrid({
  children,
  className = "",
  staggerDelay = 100,
}: AnimatedGridProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.05,
    freezeOnceVisible: true,
  });

  const childrenArray = React.Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={`grid-item-${
            // biome-ignore lint/suspicious/noArrayIndexKey: grid items are static
            index
          }`}
          className={`transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
