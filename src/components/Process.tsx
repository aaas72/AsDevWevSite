import React, { useEffect, useRef, useState } from "react";

interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

const Process: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout[]>([]);
  const hasTriggeredRef = useRef(false);

  const processSteps: ProcessStep[] = [
    {
      id: 1,
      title: "01 — Discovery & Research",
      description:
        "We start with a deep dive into your business goals, target audience, and competitors. This phase ensures we build the project on a solid strategic foundation.",
    },
    {
      id: 2,
      title: "02 — Planning & Strategy",
      description:
        "Based on the discovery phase, we create a detailed project plan, define the sitemap and architecture, and select the right technologies to ensure an efficient and organized workflow.",
    },
    {
      id: 3,
      title: "03 — UI/UX Design",
      description:
        "We turn ideas into tangible designs, starting with wireframes, then moving to visually stunning UI designs and interactive prototypes to guarantee the best user experience.",
    },
    {
      id: 4,
      title: "04 — Development",
      description:
        "We transform the approved designs into a live, interactive website or application, writing clean, efficient, and scalable code that is responsive across all devices.",
    },
    {
      id: 5,
      title: "05 — Testing & Launch",
      description:
        "Before going live, we conduct comprehensive testing on every part of the project to ensure it is bug-free and performs perfectly, then proceed with a smooth and official launch.",
    },
    {
      id: 6,
      title: "06 — Support & Growth",
      description:
        "Our work doesn’t end at launch. We provide ongoing technical support, perform regular maintenance, and analyze performance to recommend future improvements that help your business grow.",
    },
  ];

  // Progressive Reading Flow - Runs ONCE on initial load/reveal
  useEffect(() => {
    if (!isVisible || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Step 1 appears immediately on initial reveal
    setRevealedCount(1);

    const readingTimePerStep = 1200; // ms per step

    for (let i = 2; i <= processSteps.length; i++) {
      const timeout = setTimeout(() => {
        setRevealedCount(i);
        if (i === processSteps.length) {
          // After the final step completes its reading glow, mark as fully stable
          setTimeout(() => {
            setIsCompleted(true);
          }, readingTimePerStep);
        }
      }, (i - 1) * readingTimePerStep);
      timerRef.current.push(timeout);
    }

    return () => {
      timerRef.current.forEach((t) => clearTimeout(t));
    };
  }, [isVisible]);

  // One-time Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect immediately so it only triggers ONCE
        }
      },
      {
        threshold: 0.15,
        rootMargin: "-20px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header - Identical to Original Design */}
        <div
          className="flex justify-between items-center mb-12 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-15px)",
          }}
        >
          <h2 className="text-3xl font-medium text-[#C5C5C5]">
            Process Delivers Value
          </h2>
          <span className="text-[#C5C5C5] text-sm tracking-wider uppercase">
            THE APPROACH
          </span>
        </div>

        {/* 6 Process Cards with One-Time Progressive Reading Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, index) => {
            const isRevealed = index < revealedCount;
            const isCurrentlyReading =
              !isCompleted && index === revealedCount - 1;

            return (
              <div
                key={step.id}
                className={`process-step p-6 border-l-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group ${
                  isCurrentlyReading
                    ? "border-white bg-white/[0.02]"
                    : "border-[#6c6c6c] hover:border-white"
                }`}
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed
                    ? "translateX(0) scale(1)"
                    : "translateX(-45px) scale(0.95)",
                  filter: isRevealed ? "blur(0px)" : "blur(6px)",
                  pointerEvents: isRevealed ? "auto" : "none",
                }}
              >
                <h3
                  className={`text-lg font-medium mb-4 transition-colors duration-300 ${
                    isCurrentlyReading
                      ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                      : "text-[#ffffff] group-hover:text-white"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isCurrentlyReading
                      ? "text-[#E0E0E0]"
                      : "text-[#A0A0A0] group-hover:text-[#D4D4D4]"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
