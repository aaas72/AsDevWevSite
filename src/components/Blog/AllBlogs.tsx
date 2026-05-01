import React, { useEffect, useState } from "react";
import BlogCard from "../Cards/BlogCard";
import { supabase } from "../../lib/supabase";

interface Blog {
  id: string;
  title: string;
  short_description: string;
  category: string;
  date: string;
  image_url: string;
}

const AllBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setBlogs(data);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-6">
        {loading ? (
          <div className="text-center py-12 text-[#C5C5C5]">Retrieving articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                shortDescription={blog.short_description}
                category={blog.category}
                date={blog.date}
                imageUrl={blog.image_url}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBlogs;
