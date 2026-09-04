import {
  NavBar,
  PageHeader,
  MotivationalBanner,
  Footer,
  AboutMe,
  Services,
} from "../components/index";
import Seo from "../components/Seo";

function AboutMeScreen() {
  return (
    <div className="min-h-screen">
      <Seo
        title="About Abdellah Sheikh | عن عبداللاه شيخ — Profile & CV"
        description="سيرة وخبرات المهندس عبداللاه شيخ (Abdellah Sheikh). مهندس برمجيات ومطور ويب متكامل، المؤهلات والخبرات والمشاريع الهندسية. Full-Stack Software Engineer."
        keywords={[
          "Abdellah Sheikh",
          "عبداللاه شيخ",
          "عبداللاه الشيخ",
          "about abdellah sheikh",
          "سيرة ذاتية عبداللاه شيخ",
          "CV",
          "resume",
          "software engineer",
          "مهندس برمجيات"
        ]}
        canonicalPath="/about"
        image="/favicon.svg"
        type="profile"
      />
      <NavBar />
      <PageHeader title="About Me" question="Who I Am ?" />
      <AboutMe />
      <Services />
      <MotivationalBanner />
      <Footer />
    </div>
  );
}

export default AboutMeScreen;
