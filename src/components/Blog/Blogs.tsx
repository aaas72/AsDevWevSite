import React, { useEffect, useState } from "react";
import Button from "../Button";
import BlogCard from "../Cards/BlogCard";
import { Link } from "react-router-dom";
import { blogService } from "../../services";
import Loading from "../Loading";
import type { Blog } from "../../types";
import { useScrollReveal } from "../../hooks";
import { ScrollReveal } from "../ScrollReveal/ScrollReveal";

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: sectionRef, isVisible, scrollDir } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: "-20px 0px -50px 0px",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getRecent(3);
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching recent blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section ref={sectionRef} data-theme="light" className="relative w-full py-16 bg-[#E7E7E7] overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Reusable Direction-Aware Header */}
        <ScrollReveal.Header
          title="My weekly thoughts"
          badge="BLOG"
          titleColor="text-[#1E1E1E]"
          badgeColor="text-[#1E1E1E]"
          isVisible={isVisible}
          scrollDir={scrollDir}
        />

        {loading ? (
          <Loading />
        ) : (
          /* Cards Grid with Reusable 3D Stagger Entrance */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post, index) => (
              <ScrollReveal.Item
                key={post.id}
                index={index}
                totalColumns={3}
                isVisible={isVisible}
                scrollDir={scrollDir}
              >
                <BlogCard
                  id={post.id}
                  title={post.title}
                  category={post.category}
                  date={post.date}
                  imageUrl={post.image_url}
                />
              </ScrollReveal.Item>
            ))}
          </div>
        )}

        {/* Reusable Action Button with Directional Reveal */}
        <ScrollReveal.Action
          isVisible={isVisible}
          scrollDir={scrollDir}
          delayMs={450}
        >
          <Link to="/blog">
            <Button variant="outline" size="lg" className="bg-[#1E1E1E]">
              ALL POSTS
            </Button>
          </Link>
        </ScrollReveal.Action>
      </div>
    </section>
  );
};

export default Blogs;
