import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

interface BlogCardProps {
  id: string;
  title: string;
  shortDescription?: string;
  category: string;
  date: string;
  imageUrl: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, shortDescription, category, date, imageUrl }) => {
  return (
    <Link to={`/blog/${id}`} className="group">
      <div className="bg-[#1A1A1A]/40 rounded-[2.5rem] overflow-hidden h-[450px] flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-white/15 hover:border-white/30 backdrop-blur-sm">

        {/* Image Container - 65% Height */}
        <div className="h-[65%] relative overflow-hidden bg-black/20">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
          {/* Category Tag Overlay */}
          <div className="absolute top-6 left-6">
            <span className="bg-white/10 backdrop-blur-xl text-white text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full font-bold border border-white/10">
              {category}
            </span>
          </div>
        </div>

        {/* Content Container - 35% Height - Glassmorphism */}
        <div className="h-[35%] p-8 pb-16 flex flex-col justify-between bg-white/5 backdrop-blur-xl border-t border-white/5 relative">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#919191] text-[10px] font-bold tracking-widest uppercase">
                {date}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#E5E5E5] leading-tight line-clamp-1 group-hover:text-white transition-colors mb-2">
              {title}
            </h3>
            {shortDescription && (
              <p className="text-[#919191] text-xs line-clamp-2 leading-relaxed font-medium">
                {shortDescription}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] text-[#C5C5C5] group-hover:text-white transition-all duration-300 uppercase">
            EXPLORE Article
            <FiArrowUpRight className="text-lg transition-transform duration-500 group-hover:rotate-45 group-hover:scale-125" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;