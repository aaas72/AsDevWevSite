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
        title="About Me | AS.DEV"
        description="Learn more about Abdellah S.DEV, full-stack developer focused on clean architecture and performance."
        keywords={["about","developer","AS.DEV","skills"]}
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
