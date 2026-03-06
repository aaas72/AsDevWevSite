import React from "react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: number;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  postUrl?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  category,
  date,
  imageUrl,
  postUrl,
}) => {
  return (
    <Link to={postUrl || `/blog/${id}`} className="blog-card block bg-[#F5F5F5] border-1 border-[#c5c5c5] rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="blog-image overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain transition-transform duration-500 hover:scale-120"
        />
      </div>
      <div className="blog-content p-4 ">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs px-3 py-1  text-[#1E1E1E] bg-[#e0e0e0] rounded-full">{category}</span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <h3 className="text-base font-medium text-[#333333] mb-4 line-clamp-2">{title}</h3>
      </div>
    </Link>
  );
};

export default BlogCard;