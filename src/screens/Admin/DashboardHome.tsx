import React, { useEffect, useState } from "react";
import { projectService, blogService, toolService, ideaService } from "../../services";
import { FiBriefcase, FiFileText, FiTool, FiCheckSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, tools: 0, incompleteTasks: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectCount, blogCount, toolCount, incompleteTasksCount] = await Promise.all([
          projectService.getCount(),
          blogService.getCount(),
          toolService.getCount(),
          ideaService.getIncompleteCount(),
        ]);

        setStats({
          projects: projectCount,
          blogs: blogCount,
          tools: toolCount,
          incompleteTasks: incompleteTasksCount,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: "Projects", count: stats.projects, icon: <FiBriefcase />, color: "text-[#C5C5C5]" },
    { name: "Blog Posts", count: stats.blogs, icon: <FiFileText />, color: "text-[#C5C5C5]" },
    { name: "Tools", count: stats.tools, icon: <FiTool />, color: "text-[#C5C5C5]" },
    { name: "Active Tasks", count: stats.incompleteTasks, icon: <FiCheckSquare />, color: "text-[#C5C5C5]" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold tracking-tight text-[#C5C5C5]">System Overview</h2>
        <p className="text-[#919191] text-sm tracking-wide">Welcome back, Abdellah. Monitor your portfolio status below.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card) => (
          <div key={card.name} className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-[2rem] backdrop-blur-xl hover:border-white/10 transition-all duration-300">
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
          <Button 
            variant="primary"
            size="md"
            onClick={() => navigate("/admin/projects?action=new")}
          >
            NEW PROJECT
          </Button>
          <Button 
            variant="outline"
            size="md"
            onClick={() => navigate("/admin/blogs?action=new")}
          >
            WRITE BLOG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
