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
        title="Blog | AS.DEV"
        description="Technical articles and thoughts by Abdellah S.DEV on web development and design patterns."
        keywords={["blog","design patterns","web development","AS.DEV"]}
        canonicalPath="/blog"
        image="/src/assets/myPhoto.png"
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