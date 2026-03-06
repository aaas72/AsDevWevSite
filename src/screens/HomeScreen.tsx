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
        title="AS.DEV | Full-Stack Developer & Software Engineer"
        description="Portfolio, projects, blog, and services by Abdellah S.DEV, full-stack developer and software engineer."
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
