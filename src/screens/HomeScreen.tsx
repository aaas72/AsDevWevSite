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
        title="Abdellah Sheikh | عبداللاه شيخ — Full-Stack Software Engineer"
        description="الموقع الرسمي للمهندس عبداللاه شيخ (Abdellah Sheikh) — مهندس برمجيات ومطور ويب متكامل. Official portfolio and engineering projects."
        keywords={[
          "Abdellah Sheikh",
          "عبداللاه شيخ",
          "عبداللاه الشيخ",
          "abdellah sheikh",
          "software engineer",
          "full-stack developer",
          "web developer",
          "مهندس برمجيات",
          "مطور ويب",
          "portfolio"
        ]}
        canonicalPath="/"
        image="/favicon.svg"
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
