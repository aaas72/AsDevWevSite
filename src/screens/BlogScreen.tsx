import {
  NavBar,
  PageHeader,
  AllBlogs,
  MotivationalBanner,
  Footer,
} from "../components/index";
import Seo from "../components/Seo";

function BlogScreen() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Blog — AS.DEV"
        description="Thoughts and technical articles by Abdellah S.DEV on design patterns and web development."
        keywords={["blog","design patterns","web development","AS.DEV"]}
        canonicalPath="/blog"
        type="website"
      />
      <NavBar />
      <PageHeader title="Blog" question="What I'm Thinking ?" />
      <AllBlogs />
      <MotivationalBanner />
      <Footer />
    </div>
  );
}

export default BlogScreen;