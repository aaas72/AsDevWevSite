import React, { useEffect, useState } from "react";
import { blogService } from "../../services";
import BlogCard from "../Cards/BlogCard";
import Seo from "../Seo";
import Loading from "../Loading";
import TipTapContent from "../TipTapContent";
import type { Blog } from "../../types";

interface BlogPageProps {
  blogId?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogId }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      setLoading(true);

      try {
        const data = await blogService.getById(blogId);
        if (data) {
          setBlog(data);

          if (data.related_posts && data.related_posts.length > 0) {
            const related = await blogService.getByIds(data.related_posts);
            setRelatedPosts(related);
          }
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) return <Loading />;

  if (!blog) return (
    <div className="container mx-auto px-6 py-32 text-center">
      <h1 className="text-2xl font-bold text-[#C5C5C5]">Article Not Found</h1>
    </div>
  );

  return (
    <div className="blog-page">
      <Seo
        title={`${blog.title} — Abdellah Sheikh`}
        description={blog.short_description}
        keywords={[...(blog.tags || []), "Abdellah Sheikh", "عبداللاه شيخ", "blog"]}
        image={blog.cover_image || blog.image_url}
        type="article"
        canonicalPath={`/blog/${blog.id}`}
      />

      <div className="blog-header pt-32 pb-12">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C5C5C5] leading-tight mb-8">
            {blog.title}
          </h1>
          <div className="flex justify-center items-center gap-8 text-[#919191] text-sm uppercase tracking-widest flex-wrap">
            <span>{blog.date}</span>
            <span>-</span>
            <span>{blog.category}</span>
          </div>
        </div>
      </div>

      {/* Large cover image - Full Width, Fixed Height */}
      <div className="blog-cover w-full h-[250px] md:h-[350px] overflow-hidden">
        <img
          src={blog.cover_image || blog.image_url}
          alt={blog.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Blog content */}
      <div className="blog-content py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <TipTapContent content={blog.content} />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-16 flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="text-[#919191] text-sm italic">#{tag}</span>
              ))}
            </div>
          )}

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-white/10">
              <h2 className="text-2xl font-bold text-[#C5C5C5] mb-12">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
