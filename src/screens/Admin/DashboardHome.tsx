import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FiBriefcase, FiFileText, FiTool } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, tools: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const [p, b, t] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("blogs").select("*", { count: "exact", head: true }),
        supabase.from("tools").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        projects: p.count || 0,
        blogs: b.count || 0,
        tools: t.count || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: "Projects", count: stats.projects, icon: <FiBriefcase />, color: "text-[#C5C5C5]" },
    { name: "Blog Posts", count: stats.blogs, icon: <FiFileText />, color: "text-[#C5C5C5]" },
    { name: "Tools", count: stats.tools, icon: <FiTool />, color: "text-[#C5C5C5]" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold tracking-tight text-[#C5C5C5]">System Overview</h2>
        <p className="text-[#919191] text-sm tracking-wide">Welcome back, Abdellah. Monitor your portfolio status below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((card) => (
          <div key={card.name} className="p-8 bg-[#171717]/60 border border-white/5 rounded-[2rem] backdrop-blur-xl hover:border-white/10 transition-all duration-300">
            <div className={`text-3xl mb-6 ${card.color} opacity-80`}>{card.icon}</div>
            <div className="text-4xl font-bold text-white mb-2">{card.count}</div>
            <div className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-medium">{card.name}</div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-[#C5C5C5]/5 border border-[#C5C5C5]/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-[#C5C5C5]">Quick Actions</h3>
          <p className="text-sm text-[#919191] mt-2 tracking-wide">Ready to showcase a new masterpiece or share your thoughts?</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/admin/projects?action=new")}
            className="px-8 py-4 bg-[#C5C5C5] text-black rounded-2xl font-bold hover:bg-white transition-all duration-300 text-xs tracking-widest shadow-lg shadow-[#C5C5C5]/5"
          >
            NEW PROJECT
          </button>
          <button 
            onClick={() => navigate("/admin/blogs?action=new")}
            className="px-8 py-4 bg-white/5 text-[#C5C5C5] border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 text-xs tracking-widest"
          >
            WRITE BLOG
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
