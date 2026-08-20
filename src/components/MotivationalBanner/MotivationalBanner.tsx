import React, { useRef } from "react";
import "./MotivationalBanner.css";

const phrases = [
  "BUILD YOUR VISION",
  "JR VISION",
  "CREATE YOUR FUTURE",
  "INNOVATE DAILY",
];

// 5 rows with alternating movement directions & class names
const rows = [
  { direction: "rtl-1" },
  { direction: "ltr-1" },
  { direction: "rtl-2" },
  { direction: "ltr-2" },
  { direction: "rtl-3" },
];

const MotivationalBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates (-1 to 1) from container center
      const normX = (e.clientX - centerX) / (rect.width / 2);
      const normY = (e.clientY - centerY) / (rect.height / 2);

      // Max shadow projection offset (up to ±16px)
      const shadowX = (normX * 16).toFixed(1);
      const shadowY = (normY * 16).toFixed(1);

      container.style.setProperty("--shadow-x", `${shadowX}px`);
      container.style.setProperty("--shadow-y", `${shadowY}px`);
      container.style.setProperty("--shadow-opacity", "1");
    });
  };

  const handleMouseLeave = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    const container = containerRef.current;
    if (!container) return;

    // Smoothly hide the shadow in default/idle state
    container.style.setProperty("--shadow-x", "0px");
    container.style.setProperty("--shadow-y", "0px");
    container.style.setProperty("--shadow-opacity", "0");
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-12 md:py-16 overflow-hidden select-none cursor-default"
      style={{
        ["--shadow-x" as string]: "0px",
        ["--shadow-y" as string]: "0px",
        ["--shadow-opacity" as string]: "0",
      }}
    >
      {/* 5 Rows with 3D Directional Protruding Shadows */}
      <div className="space-y-3 md:space-y-4 relative z-10">
        {rows.map((row, i) => (
          <div
            key={i}
            className="banner-row overflow-hidden whitespace-nowrap py-1"
          >
            {[0, 1].map((j) => (
              <div
                key={j}
                className={`banner-content inline-block marquee-${row.direction}`}
              >
                {phrases.map((phrase, k) => (
                  <span
                    key={`${j}-${k}`}
                    className="shadow-phrase inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mx-6 font-black uppercase"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MotivationalBanner;
