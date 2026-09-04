import React from "react";
import { useParams } from "react-router-dom";
import { NavBar, ProjectPage, Footer } from "../components/index";
import Seo from "../components/Seo";

const ProjectScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <div className="min-h-screen ">
      <Seo
        title={`Project Details | Abdellah Sheikh`}
        description="Detailed software engineering project by Abdellah Sheikh (عبداللاه شيخ)."
        keywords={["project", "Abdellah Sheikh", "عبداللاه شيخ", "case study", "software engineer"]}
        canonicalPath={`/project/${projectId ?? ""}`}
        image="/favicon.svg"
        type="article"
      />
      <NavBar />
      <ProjectPage projectId={projectId} />
      <Footer />
    </div>
  );
};

export default ProjectScreen;