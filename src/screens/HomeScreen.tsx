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
        title="AS.DEV — Full-Stack Developer & Software Engineer"
        description="Portfolio of Abdellah S.DEV: projects, blog, and services in full‑stack web development."
        keywords={["AS.DEV","full-stack","web development","portfolio","blog","projects"]}
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
