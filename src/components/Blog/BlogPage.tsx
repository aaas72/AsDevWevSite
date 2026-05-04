import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BlogCard from "../Cards/BlogCard";
import Seo from "../Seo";
import Loading from "../Loading";

interface BlogPageProps {
  blogId?: string;
}

interface Blog {
  id: string;
  title: string;
  short_description: string;
  category: string;
  date: string;
  image_url: string;
  cover_image: string;
  content: string;
  author: string;
  tags: string[];
  related_posts: string[];
}

const BlogPage: React.FC<BlogPageProps> = ({ blogId }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();

      if (!error && data) {
        setBlog(data);

        if (data.related_posts && data.related_posts.length > 0) {
          const { data: related } = await supabase
            .from("blogs")
            .select("*")
            .in("id", data.related_posts);
          if (related) setRelatedPosts(related);
        }
      }
      setLoading(false);
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
        title={`${blog.title} — AS.DEV`}
        description={blog.short_description}
        keywords={[...(blog.tags || []), "AS.DEV", "blog"]}
        image={blog.cover_image || blog.image_url}
        type="article"
        canonicalPath={`/blog/${blog.id}`}
      />

      <div className="blog-header py-32">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="tag inline-block bg-[#2A2A2A] text-xs text-[#C5C5C5] px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
            {blog.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#C5C5C5] leading-tight mb-8">
            {blog.title}
          </h1>
          <div className="flex justify-center items-center gap-8 text-[#919191] text-sm uppercase tracking-widest">
            <span>{blog.author}</span>
            <span className="w-1 h-1 bg-[#919191] rounded-full"></span>
            <span>{blog.date}</span>
          </div>
        </div>
      </div>

      {/* Large cover image - Full Width */}
      <div className="blog-cover w-full overflow-hidden">
        <img
          src={blog.cover_image || blog.image_url}
          alt={blog.title}
          className="w-full h-auto"
        />
      </div>

      {/* Blog content */}
      <div className="blog-content py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div
            className="prose prose-invert prose-lg max-w-none text-[#C5C5C5] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

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
