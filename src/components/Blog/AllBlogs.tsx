import React, { useEffect, useState } from "react";
import BlogCard from "../Cards/BlogCard";
import { blogService } from "../../services";
import Loading from "../Loading";
import type { Blog } from "../../types";
import { useScrollReveal } from "../../hooks";
import { ScrollReveal } from "../ScrollReveal/ScrollReveal";

const AllBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: sectionRef, isVisible, scrollDir } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: "-20px 0px -50px 0px",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAll();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching all blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {blogs.map((blog, index) => (
              <ScrollReveal.Item
                key={blog.id}
                index={index}
                totalColumns={4}
                isVisible={isVisible}
                scrollDir={scrollDir}
              >
                <BlogCard
                  id={blog.id}
                  title={blog.title}
                  shortDescription={blog.short_description}
                  category={blog.category}
                  date={blog.date}
                  imageUrl={blog.image_url}
                />
              </ScrollReveal.Item>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBlogs;
