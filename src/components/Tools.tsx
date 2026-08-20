import React, { useEffect, useState, useRef } from "react";
import { toolService } from "../services";
import Loading from "./Loading";
import type { Tool } from "../types";

interface ToolsProps {
  bgColor?: string;
}

const Tools: React.FC<ToolsProps> = ({ bgColor }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemElementsRef = useRef<{ el: HTMLElement; cx: number; cy: number }[]>([]);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await toolService.getAll();
        setTools(data);
      } catch (err) {
        console.error("Error fetching tools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Track scroll direction smoothly
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

  // Recurring IntersectionObserver to trigger smooth wave scroll reveal on every scroll
  useEffect(() => {
    if (loading || tools.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "-40px 0px -100px 0px", threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loading, tools.length]);

  // Update cached centers of all tool elements on load / resize / scroll / after reveal
  const updateCachedPositions = () => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll<HTMLElement>(".tool-item");
    const cached: { el: HTMLElement; cx: number; cy: number }[] = [];
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      cached.push({
        el,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      });
    });
    itemElementsRef.current = cached;
  };

  useEffect(() => {
    if (!loading && tools.length > 0) {
      updateCachedPositions();
      // Update positions right after the cinematic wave settles
      const timeout = setTimeout(updateCachedPositions, 1400);
      window.addEventListener("resize", updateCachedPositions, { passive: true });
      window.addEventListener("scroll", updateCachedPositions, { passive: true });
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("resize", updateCachedPositions);
        window.removeEventListener("scroll", updateCachedPositions);
      };
    }
  }, [loading, tools, isVisible]);

  // Instantaneous 120 FPS proximity calculation using requestAnimationFrame
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const radius = 190; // Spotlight radius

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const items = itemElementsRef.current;
      const len = items.length;
      for (let i = 0; i < len; i++) {
        const item = items[i];
        const dist = Math.hypot(mouseX - item.cx, mouseY - item.cy);
        const intensity = dist < radius ? 1 - dist / radius : 0;
        item.el.style.setProperty("--intensity", intensity.toFixed(3));
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    const items = itemElementsRef.current;
    const len = items.length;
    for (let i = 0; i < len; i++) {
      items[i].el.style.setProperty("--intensity", "0");
    }
  };

  const backgroundStyle = bgColor
    ? { background: bgColor }
    : { background: "linear-gradient(to bottom, #000000b1, transparent, transparent)" };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[400px] py-16 flex items-center justify-center select-none overflow-hidden"
    >
      <div className="absolute inset-0 z-0" style={backgroundStyle}></div>
      <div className="relative z-10 max-w-6xl w-full px-6 mx-auto flex flex-col items-center justify-center">
        {/* Title with smooth fade-in-up - Direction Aware */}
        <h3
          className="text-3xl font-medium text-center text-[#C5C5C5] mb-12 tracking-tight transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : `translateY(${scrollDir === "down" ? "26px" : "-26px"})`,
            filter: isVisible ? "blur(0px)" : "blur(4px)",
          }}
        >
          My Tools
        </h3>

        {loading ? (
          <Loading />
        ) : (
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={updateCachedPositions}
            onMouseLeave={handleMouseLeave}
            className="relative w-full py-6"
          >
            {/* SINGLE LAYER: Intelligent Bi-Directional Wave Scroll Reveal + Proximity Spotlight */}
            <div className="tools-flex w-full flex flex-wrap justify-center items-center gap-10 md:gap-12 py-4 relative z-10">
              {tools.map((tool, index) => {
                const yOffset = scrollDir === "down" ? 42 : -42;
                return (
                  <div
                    key={tool.id}
                    className="tool-item flex flex-col items-center justify-center text-center min-w-[80px]"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0) scale(1)" : `translateY(${yOffset}px) scale(0.85)`,
                      filter: isVisible ? "blur(0px)" : "blur(6px)",
                      transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 55}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 55}ms, filter 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${index * 55}ms`,
                    }}
                  >
                  <div
                    className="tool-icon w-12 h-12 mb-3 flex items-center justify-center will-change-[filter,opacity]"
                    style={{
                      filter: "grayscale(calc(100% - (var(--intensity, 0) * 100%)))",
                      opacity: "calc(0.35 + (var(--intensity, 0) * 0.65))",
                    }}
                  >
                    {tool.icon_url ? (
                      <img
                        src={tool.icon_url}
                        alt={tool.name}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-white/10 rounded-full" />
                    )}
                  </div>
                  <span
                    className="tool-name text-xs tracking-wide will-change-[color,opacity]"
                    style={{
                      color: "color-mix(in srgb, #ffffff calc(var(--intensity, 0) * 100%), #C5C5C5)",
                      opacity: "calc(0.35 + (var(--intensity, 0) * 0.65))",
                    }}
                  >
                    {tool.name}
                  </span>
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Tools;
