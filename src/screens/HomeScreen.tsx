import {
  NavBar,
  Header,
  Tools,
  Projects,
  Process,
  Blogs,
  MotivationalBanner,
  Footer
} from "../components/index";
import Seo from "../components/Seo";

function HomeScreen() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Abdellah Sheikh (Abdellah Aidaros) | AS.DEV — Software Engineer"
        description="Official website and portfolio of Abdellah Sheikh (Abdellah Aidaros / عبداللاه عيدروس / عبداللاه شيخ / AS.DEV). Full-Stack Software Engineer & Web Developer."
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
          "full-stack developer",
          "software engineer",
          "web development",
          "portfolio"
        ]}
        canonicalPath="/"
        image="/src/assets/myPhoto.png"
        type="website"
      />
      <NavBar />
      <Header />
      <Tools />
      <Projects />
      <Process />
      <Blogs />
      <MotivationalBanner />
      <Footer />
    </div>
  );
}

export default HomeScreen;
