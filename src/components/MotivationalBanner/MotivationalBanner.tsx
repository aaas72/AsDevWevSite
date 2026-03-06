import React from "react";
import "./MotivationalBanner.css";

const phrases = ["BUILD YOUR VISION", "JR VISION", "CREATE YOUR FUTURE", "INNOVATE DAILY"];

const rows = [
  { direction: "rtl" },
  { direction: "ltr" },
  { direction: "rtl" },
];

const MotivationalBanner: React.FC = () => {
  return (
    <section className="relative w-full py-16 overflow-hidden">
      <div className="absolute inset-0"></div>

      {rows.map((row, i) => (
        <div key={i} className="banner-row overflow-hidden whitespace-nowrap py-4">
          {[0, 1].map((j) => (
            <div
              key={j}
              className={`banner-content inline-block marquee-${row.direction}`}
            >
              {phrases.map((phrase, k) => (
                <span
                  key={k}
                  className="text-4xl md:text-4xl font-medium text-[#C5C5C5] mx-4"
                >
                  {phrase}
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default MotivationalBanner;
