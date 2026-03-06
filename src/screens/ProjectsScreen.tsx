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
    <div className="min-h-screen ">
      <Seo
        title="Projects — AS.DEV"
        description="Selected projects by Abdellah S.DEV across full‑stack web development and software engineering."
        keywords={["projects","portfolio","AS.DEV"]}
        canonicalPath="/projects"
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
