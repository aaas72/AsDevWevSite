import React, { useEffect, useState } from "react";
import Button from "../Button";
import BlogCard from "../Cards/BlogCard";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Blog {
  id: string;
  title: string;
  category: string;
  date: string;
  image_url: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (!error && data) {
        setBlogs(data);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <section className="relative w-full py-16 bg-[#E7E7E7]">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-medium text-[#1E1E1E]">
            My weekly thoughts
          </h2>
          <span className="text-[#1E1E1E]">BLOG</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#1E1E1E]">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                category={post.category}
                date={post.date}
                imageUrl={post.image_url}
              />
            ))}
          </div>
        )}

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
