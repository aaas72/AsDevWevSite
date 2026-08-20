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
        title="Projects & Engineering Systems | Abdellah Sheikh (Abdellah Aidaros) — AS.DEV"
        description="Explore selected web applications, cloud architectures, and software engineering projects by Abdellah Sheikh (Abdellah Aidaros / عبداللاه عيدروس / عبداللاه شيخ / AS.DEV)."
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
          "projects",
          "engineered systems",
          "portfolio"
        ]}
        canonicalPath="/projects"
        image="/src/assets/myPhoto.png"
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
