import React from "react";
import Button from "../Button";
import BlogCard from "../Cards/BlogCard";
import { Link } from "react-router-dom";
import blogsData from "../../../public/data/blogs.json";

const Blogs: React.FC = () => {
  return (
    <section className="relative w-full py-16 bg-[#E7E7E7]">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-medium text-[#1E1E1E]">
            My weekly thoughts
          </h2>
          <span className="text-[#1E1E1E]">BLOG</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogsData.blogs.slice(-3).reverse().map((post) => (
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

        <div className="flex justify-center mt-12">
          <Link to="/blog">
            <Button variant="outline" size="lg" className="bg-[#1E1E1E] ">
              ALL POSTS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
