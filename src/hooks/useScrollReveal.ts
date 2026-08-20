import { useCallback, useEffect, useRef, useState } from "react";

export interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const {
    threshold = 0.05,
    rootMargin = "-20px 0px -50px 0px",
    once = false,
  } = options;

  const [node, setNode] = useState<T | null>(null);
  const ref = useRef<T | null>(null);

  // Callback ref guarantees observer attaches even if component renders asynchronously
  const setRef = useCallback((element: T | null) => {
    ref.current = element;
    setNode(element);
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");

  // Track scroll direction smoothly using requestAnimationFrame
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset;
          if (currentScrollY > lastScrollY + 2) {
            setScrollDir("down");
          } else if (currentScrollY < lastScrollY - 2) {
            setScrollDir("up");
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver on node
  useEffect(() => {
    const target = node || ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin, once]);

  return { ref: setRef, isVisible, scrollDir };
}

export default useScrollReveal;
