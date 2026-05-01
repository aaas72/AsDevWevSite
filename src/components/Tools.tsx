import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Tool {
  id: string;
  name: string;
  icon_url: string;
}

interface ToolsProps {
  bgColor?: string;
}

const Tools: React.FC<ToolsProps> = ({ bgColor }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (!error && data) {
        setTools(data);
      }
      setLoading(false);
    };

    fetchTools();
  }, []);

  const backgroundStyle = bgColor
    ? { background: bgColor }
    : { background: 'linear-gradient(to bottom, #000000b1, transparent, transparent)' };

  return (
    <section className="relative w-full min-h-[400px] py-16 flex items-center justify-center">
      <div className="absolute inset-0 z-0" style={backgroundStyle}></div>
      <div className="relative z-10 max-w-6xl w-full px-6 mx-auto flex flex-col items-center justify-center">
        <h3 className="text-3xl font-medium text-center text-[#C5C5C5] mb-12">
          My Tools
        </h3>
        {loading ? (
          <div className="text-[#C5C5C5]">Loading tools...</div>
        ) : (
          <div className="tools-flex w-full flex flex-wrap justify-center items-center gap-12 py-4">
            {tools.map((tool) => (
              <div key={tool.id} className="tool-item flex flex-col items-center justify-center text-center min-w-[80px] group">
                <div className="tool-icon w-12 h-12 mb-3 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                  {tool.icon_url ? (
                    <img src={tool.icon_url} alt={tool.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-8 h-8 bg-white/10 rounded-full" />
                  )}
                </div>
                <span className="tool-name text-xs text-[#C5C5C5] opacity-60 group-hover:opacity-100 transition-opacity">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Tools;
