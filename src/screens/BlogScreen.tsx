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
        title="Technical Blog | مدونة Abdellah Sheikh — عبداللاه شيخ"
        description="مقالات هندسية ورؤى معمارية برمجية يكتبها المهندس عبداللاه شيخ (Abdellah Sheikh). Software engineering insights and architecture."
        keywords={[
          "Abdellah Sheikh",
          "عبداللاه شيخ",
          "عبداللاه الشيخ",
          "Abdellah Sheikh blog",
          "مدونة عبداللاه شيخ",
          "blog",
          "software engineering blog",
          "web architecture"
        ]}
        canonicalPath="/blog"
        image="/favicon.svg"
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