import React from "react";
import BlogCard from "../Cards/BlogCard";
import blogsData from "../../../public/data/blogs.json";

const AllBlogs: React.FC = () => {
  return (
    <section className="relative w-full py-16 bg-[#E7E7E7]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogsData.blogs.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={post.title}
              category={post.category}
              date={post.date}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllBlogs;
