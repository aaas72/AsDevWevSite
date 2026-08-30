import {
  NavBar,
  PageHeader,
  AllBlogs,
  Footer,
} from "../components/index";
import Seo from "../components/Seo";

function BlogScreen() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Technical Blog & Architecture Insights | Abdellah Sheikh (Abdellah Aidaros) — AS.DEV"
        description="Technical articles, system design patterns, and engineering insights by Abdellah Sheikh (Abdellah Aidaros / عبداللاه عيدروس / عبداللاه شيخ / AS.DEV)."
        keywords={[
          "Abdellah Sheikh",
          "Abdellah Aidaros",
          "AS.DEV",
          "asdev",
          "as-dev",
          "as.dev",
          "as dev",
          "عبداللاه عيدروس",
          "عبداللاه شيخ",
          "عبداللاه الشيخ",
          "blog",
          "software engineering blog",
          "web architecture"
        ]}
        canonicalPath="/blog"
        image="/src/assets/myPhoto.png"
        type="website"
      />
      <NavBar />
      <PageHeader title="Blog" question="What I'm Thinking ?" />
      <AllBlogs />
      <Footer />
    </div>
  );
}

export default BlogScreen;