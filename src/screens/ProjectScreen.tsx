import React from "react";
import { useParams } from "react-router-dom";
import { NavBar, ProjectPage, Footer } from "../components/index";
import Seo from "../components/Seo";

const ProjectScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <div className="min-h-screen ">
      <Seo
        title={`Project Details | AS.DEV`}
        description="Detailed view of a project by Abdellah S.DEV."
        keywords={["project","AS.DEV","case study"]}
        canonicalPath={`/project/${projectId ?? ""}`}
        image="/src/assets/myPhoto.png"
        type="article"
      />
      <NavBar />
      <ProjectPage projectId={projectId} />
      <Footer />
    </div>
  );
};

export default ProjectScreen;