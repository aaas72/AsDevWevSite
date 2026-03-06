import React from "react";
import { FaReact, FaNodeJs, FaSass, FaDocker, FaFigma } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiDotnet,
} from "react-icons/si";
import { FaTerminal } from "react-icons/fa";

interface ToolsProps {
  bgColor?: string;
}

const Tools: React.FC<ToolsProps> = ({ bgColor }) => {
  const tools = [
    { name: "React", icon: <FaReact />, color: "text-[#61DAFB]" },
    { name: "Next.js", icon: <SiNextdotjs />, color: "text-white" },
    { name: "Tailwind", icon: <SiTailwindcss />, color: "text-[#38BDF8]" },
    { name: "Sass", icon: <FaSass />, color: "text-[#CD6799]" },
    { name: "Node.js", icon: <FaNodeJs />, color: "text-[#8CC84B]" },
    { name: "Express", icon: <SiExpress />, color: "text-white" },
    { name: "MongoDB", icon: <SiMongodb />, color: "text-[#4DB33D]" },
    { name: "MySQL", icon: <SiMysql />, color: "text-[#4479A1]" },
    { name: "ASP.NET", icon: <SiDotnet />, color: "text-[#512BD4]" },
    { name: "Docker", icon: <FaDocker />, color: "text-[#2496ED]" },
    { name: "Figma", icon: <FaFigma />, color: "text-[#F24E1E]" },
    { name: "Unix", icon: <FaTerminal />, color: "text-[#F5F5F5]" },
    { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-[#336791]" },
  ];

  // تحديد الخلفية بناءً على الخاصية bgColor
  const backgroundStyle = bgColor
    ? { background: bgColor }
    : { background: 'linear-gradient(to bottom, #000000b1, transparent, transparent)' };

  return (
    <section className="relative w-full min-h-[500px] py-16 flex items-center justify-center">
      <div className="absolute inset-0 z-0" style={backgroundStyle}></div>
      <div className="relative z-10 max-w-6xl w-full px-6 mx-auto flex flex-col items-center justify-center">
        <h3 className="text-3xl font-medium text-center text-[#C5C5C5] mb-12">
          My Tools
        </h3>
        <div className="tools-flex w-full flex flex-wrap justify-center items-center gap-8 py-4">
          {tools.map((tool, index) => (
            <div key={index} className="tool-item flex flex-col items-center justify-center text-center min-w-[120px]">
              <div className={`tool-icon text-4xl ${tool.color} mb-2`}>
                {tool.icon}
              </div>
              <span className="tool-name text-sm text-[#C5C5C5]">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
