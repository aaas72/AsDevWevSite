import React from "react";
import ProjectCard from "../Cards/ProjectCard";
import projectsData from "../../../public/data/projects.json";

const AllProjects: React.FC = () => {
  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projectsData.projects.slice().reverse().map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              imageUrl={project.imageUrl}
              projectUrl={project.projectUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProjects;
