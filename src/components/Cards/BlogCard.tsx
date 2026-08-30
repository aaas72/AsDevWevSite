import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../Button";

interface BlogCardProps {
  id: string;
  title: string;
  shortDescription?: string;
  category: string;
  date: string;
  imageUrl: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, shortDescription, category, date, imageUrl, isAdmin, onEdit, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const CardWrapper = isAdmin ? "div" : Link;
  const wrapperProps = isAdmin ? { className: "group h-full" } : { to: `/blog/${id}`, className: "group h-full block" };

  return (
    <CardWrapper {...(wrapperProps as any)}>
      <div className="bg-[#1A1A1A]/40 rounded-[2.5rem] overflow-hidden aspect-[4/5] h-full flex flex-col transition-all duration-500 border border-white/15 hover:border-white/30 backdrop-blur-sm">

        {/* Image Container - 55% Height */}
        <div className="h-[55%] relative overflow-hidden bg-black/20">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-loader z-10"></div>
          )}
          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out transform-gpu group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Content Container - Glassmorphism */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-white/10 backdrop-blur-3xl border-t border-white/20 relative">
          <div>
            <div className="flex justify-between items-center mb-3 gap-2 overflow-hidden">
              <span className="text-[#919191] text-[10px] font-bold tracking-widest uppercase shrink-0">
                {date}
              </span>
              <div className="flex-1 overflow-hidden relative flex justify-end">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 overflow-hidden max-w-[110px]">
                  <span className="text-[#C5C5C5] text-[8px] uppercase tracking-[0.2em] font-bold truncate">
                    {category}
                  </span>
                </div>
              </div>
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

          {isAdmin ? (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
              <Button 
                variant="secondary"
                size="sm"
                icon
                onClick={(e) => { e.preventDefault(); onEdit?.(); }} 
              >
                <FiEdit2 />
              </Button>
              <Button 
                variant="danger"
                size="sm"
                icon
                onClick={(e) => { e.preventDefault(); onDelete?.(); }} 
              >
                <FiTrash2 />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] text-[#C5C5C5] group-hover:text-white transition-all duration-300 uppercase mt-4">
              EXPLORE Article
              <FiArrowUpRight className="text-lg transition-transform duration-500 group-hover:rotate-45 group-hover:scale-125" />
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

export default BlogCard;