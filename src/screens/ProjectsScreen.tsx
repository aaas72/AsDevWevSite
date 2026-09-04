import {
  NavBar,
  PageHeader,
  AllProjects,
  MotivationalBanner,
  Footer,
} from "../components/index";
import Seo from "../components/Seo";

function ProjectsScreen() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Projects & Engineering Systems | مشاريع Abdellah Sheikh — عبداللاه شيخ"
        description="معرض المشاريع والتطبيقات والأنظمة البرمجية للمهندس عبداللاه شيخ (Abdellah Sheikh). Selected web applications and architectures."
        keywords={[
          "Abdellah Sheikh",
          "عبداللاه شيخ",
          "عبداللاه الشيخ",
          "Abdellah Sheikh projects",
          "مشاريع عبداللاه شيخ",
          "projects",
          "software engineering",
          "portfolio"
        ]}
        canonicalPath="/projects"
        image="/favicon.svg"
        type="website"
      />
      <NavBar />
      <PageHeader title="Projects" question="What I've Built ?" />
      <AllProjects />
      <MotivationalBanner />
      <Footer />
    </div>
  );
}

export default ProjectsScreen;
