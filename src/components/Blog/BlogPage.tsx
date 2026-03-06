import React from "react";
import blogsData from "../../../public/data/blogs.json";
import BlogCard from "../Cards/BlogCard";
import Seo from "../Seo";

interface BlogPageProps {
  blogId?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogId }) => {
  // Find blog based on ID
  const blog = blogsData.blogs.find(
    (b) => b.id === (blogId ? parseInt(blogId) : 0)
  );

  // If blog not found, display error message
  if (!blog) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">
          Blog Post Not Found
        </h1>
      </div>
    );
  }

  // Find related posts
  const relatedPosts = blog.relatedPosts
    ? blogsData.blogs.filter((b) => blog.relatedPosts?.includes(b.id))
    : [];

  return (
    <div className="blog-page">
      <Seo
        title={`${blog.title} — AS.DEV`}
        description={blog.shortDescription}
        keywords={[...(blog.tags || []), "AS.DEV", "blog"]}
        image={blog.coverImage || blog.imageUrl}
        type="article"
        canonicalPath={`/blog/${blog.id}`}
      />
      <div className="blog-header py-4 sm:py-6 md:py-8 text-[#C5C5C5]">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Blog card */}
          <div className="text-center p-4 sm:p-6 mb-4 sm:mb-8 mt-16 sm:mt-24 md:mt-32">
            <div className="tag inline-block bg-[#C5C5C5] text-xs sm:text-sm text-[#1E1E1E] px-2 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
              {blog.category}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#C5C5C5] mb-3 sm:mb-6">
              {blog.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#C5C5C5] mb-4 sm:mb-8 max-w-3xl mx-auto">
              {blog.shortDescription}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-8 space-y-2 sm:space-y-0">
              <div className="flex items-center sm:mr-8">
                <span className="text-xs sm:text-sm text-[#C5C5C5]">{blog.author}</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm text-[#C5C5C5]">{blog.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Large cover image */}
      <div className="flex justify-center w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6">
        <div className="blog-cover">
          <img
            src={blog.coverImage}
            alt={`${blog.title} Cover`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="max-w-full h-auto"
          />
        </div>
      </div>
      {/* Blog content */}
      <div className="blog-content py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
            <div
              className="prose prose-sm sm:prose md:prose-lg lg:prose-xl max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-[1000px] mx-auto text-[#C5C5C5] prose-headings:text-[#E5E5E5] prose-headings:font-bold 
              prose-h1:text-3xl sm:prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mt-8 sm:prose-h1:mt-12 md:prose-h1:mt-16 prose-h1:mb-6 sm:prose-h1:mb-8 md:prose-h1:mb-10 
              prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-6 sm:prose-h2:mt-10 md:prose-h2:mt-14 
              prose-h2:mb-4 sm:prose-h2:mb-6 md:prose-h2:mb-8 prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-6 sm:prose-h3:mt-8 md:prose-h3:mt-12 prose-h3:mb-3 sm:prose-h3:mb-4 md:prose-h3:mb-6 
              prose-p:text-base sm:prose-p:text-lg md:prose-p:text-xl prose-p:my-4 sm:prose-p:my-6 md:prose-p:my-10 prose-p:leading-relaxed sm:prose-p:leading-[2] md:prose-p:leading-[2.2] prose-p:tracking-normal sm:prose-p:tracking-wide 
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline 
              prose-blockquote:border-l-4 prose-blockquote:border-[#505050] 
              prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#A5A5A5] prose-blockquote:text-lg sm:prose-blockquote:text-xl 
              prose-ul:my-4 sm:prose-ul:my-6 md:prose-ul:my-10 prose-ul:list-disc prose-ul:pl-5 sm:prose-ul:pl-8 prose-ol:my-4 sm:prose-ol:my-6 md:prose-ol:my-10 
              prose-ol:list-decimal prose-ol:pl-5 sm:prose-ol:pl-8 prose-li:my-2 sm:prose-li:my-3 md:prose-li:my-5 prose-li:pl-2 sm:prose-li:pl-3 prose-li:text-base sm:prose-li:text-lg md:prose-li:text-xl 
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-6 sm:prose-img:my-8 md:prose-img:my-12 
              prose-code:text-[#E5E5E5] prose-code:bg-[#2A2A2A] prose-code:px-1 sm:prose-code:px-2 
              prose-code:py-0.5 sm:prose-code:py-1 prose-code:rounded prose-code:text-sm sm:prose-code:text-base md:prose-code:text-lg prose-pre:bg-[#2A2A2A] 
              prose-pre:p-3 sm:prose-pre:p-4 md:prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto 
              prose-pre:my-4 sm:prose-pre:my-6 md:prose-pre:my-10 prose-pre:text-sm sm:prose-pre:text-base md:prose-pre:text-lg prose-table:border-collapse prose-table:w-full 
              prose-table:my-6 sm:prose-table:my-8 md:prose-table:my-12 prose-th:border prose-th:border-[#505050] 
              prose-th:p-2 sm:prose-th:p-3 md:prose-th:p-4 prose-th:bg-[#2A2A2A] prose-th:text-base sm:prose-th:text-lg md:prose-th:text-xl prose-td:border prose-td:border-[#505050] 
              prose-td:p-2 sm:prose-td:p-3 md:prose-td:p-4 prose-td:text-base sm:prose-td:text-lg md:prose-td:text-xl"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[#C5C5C5] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-8 sm:mt-12 md:mt-16 ">
              <h2 className="text-xl sm:text-2xl font-bold text-[#C5C5C5] mb-4 sm:mb-6 px-4 sm:px-0">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
                {relatedPosts.map((post) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
