import React from "react";
import { useParams } from "react-router-dom";
import { NavBar, BlogPage, Footer } from "../components/index";
import Seo from "../components/Seo";

const BlogPostScreen: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  
  return (
    <div className="min-h-screen">
      <Seo
        title={`Blog Post — AS.DEV`}
        description="Detailed technical blog post by Abdellah S.DEV."
        keywords={["blog","article","AS.DEV"]}
        canonicalPath={`/blog/${blogId ?? ""}`}
        type="article"
      />
      <NavBar />
      <BlogPage blogId={blogId} />
      <Footer />
    </div>
  );
};

export default BlogPostScreen;