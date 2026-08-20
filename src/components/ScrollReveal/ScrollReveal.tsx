import React from "react";

// ============================================================================
// 1. ScrollReveal.Header Component
// ============================================================================
export interface ScrollRevealHeaderProps {
  title: string | React.ReactNode;
  badge?: string | React.ReactNode;
  isVisible: boolean;
  scrollDir?: "down" | "up";
  titleColor?: string;
  badgeColor?: string;
  className?: string;
}

export const ScrollRevealHeader: React.FC<ScrollRevealHeaderProps> = ({
  title,
  badge,
  isVisible,
  scrollDir = "down",
  titleColor = "text-[#C5C5C5]",
  badgeColor = "text-[#C5C5C5]",
  className = "flex justify-between items-center mb-12",
}) => {
  return (
    <div
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0)"
          : `translateY(${scrollDir === "down" ? "30px" : "-30px"})`,
        filter: isVisible ? "blur(0px)" : "blur(4px)",
      }}
    >
      {typeof title === "string" ? (
        <h2 className={`text-3xl font-medium ${titleColor}`}>{title}</h2>
      ) : (
        title
      )}

      {badge && (
        typeof badge === "string" ? (
          <span className={`${badgeColor} text-sm tracking-widest uppercase`}>
            {badge}
          </span>
        ) : (
          badge
        )
      )}
    </div>
  );
};

// ============================================================================
// 2. ScrollReveal.Item Component (3D Entrance Card with Stagger)
// ============================================================================
export interface ScrollRevealItemProps {
  index: number;
  isVisible: boolean;
  scrollDir?: "down" | "up";
  totalColumns?: number;
  xOffset?: number;
  yOffset?: number;
  staggerMs?: number;
  className?: string;
  children: React.ReactNode;
}

export const ScrollRevealItem: React.FC<ScrollRevealItemProps> = ({
  index,
  isVisible,
  scrollDir = "down",
  totalColumns = 3,
  xOffset,
  yOffset,
  staggerMs = 140,
  className = "",
  children,
}) => {
  // Compute smart horizontal offset based on column position if not explicitly supplied
  const defaultY = scrollDir === "down" ? 55 : -55;
  const colIndex = index % totalColumns;
  let defaultX = 0;
  if (totalColumns === 2) {
    defaultX = colIndex === 0 ? -30 : 30;
  } else if (totalColumns >= 3) {
    defaultX = colIndex === 0 ? -35 : colIndex === totalColumns - 1 ? 35 : 0;
  }

  const finalX = xOffset !== undefined ? xOffset : defaultX;
  const finalY = yOffset !== undefined ? yOffset : defaultY;
  const delay = index * staggerMs;

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(${finalX}px, ${finalY}px, 0) scale(0.92)`,
        filter: isVisible ? "blur(0px)" : "blur(8px)",
        transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 3. ScrollReveal.Action Component (Bottom Buttons/Links with delay)
// ============================================================================
export interface ScrollRevealActionProps {
  isVisible: boolean;
  scrollDir?: "down" | "up";
  delayMs?: number;
  className?: string;
  children: React.ReactNode;
}

export const ScrollRevealAction: React.FC<ScrollRevealActionProps> = ({
  isVisible,
  scrollDir = "down",
  delayMs = 450,
  className = "flex justify-center mt-12",
  children,
}) => {
  return (
    <div
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0)"
          : `translateY(${scrollDir === "down" ? "24px" : "-24px"})`,
        transitionDelay: isVisible ? `${delayMs}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

// Namespace export
export const ScrollReveal = {
  Header: ScrollRevealHeader,
  Item: ScrollRevealItem,
  Action: ScrollRevealAction,
};

export default ScrollReveal;
