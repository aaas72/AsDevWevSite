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
        title="About Abdellah Sheikh (Abdellah Aidaros) | AS.DEV — Profile & CV"
        description="Learn more about Abdellah Sheikh (Abdellah Aidaros / عبداللاه عيدروس / عبداللاه شيخ / AS.DEV), Full-Stack Software Engineer, skills, background, and career journey."
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
          "about abdellah",
          "CV",
          "resume",
          "software engineer"
        ]}
        canonicalPath="/about"
        image="/src/assets/myPhoto.png"
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
