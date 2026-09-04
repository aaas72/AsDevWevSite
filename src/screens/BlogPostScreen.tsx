import React from "react";
import { useParams } from "react-router-dom";
import { NavBar, BlogPage, Footer } from "../components/index";
import Seo from "../components/Seo";

const BlogPostScreen: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  
  return (
    <div className="min-h-screen">
      <Seo
        title={`Blog Post | Abdellah Sheikh`}
        description="Detailed technical blog post by Abdellah Sheikh (عبداللاه شيخ)."
        keywords={["blog", "article", "Abdellah Sheikh", "عبداللاه شيخ", "software engineering"]}
        canonicalPath={`/blog/${blogId ?? ""}`}
        image="/favicon.svg"
        type="article"
      />
      <NavBar />
      <BlogPage blogId={blogId} />
      <Footer />
    </div>
  );
};

export default BlogPostScreen;