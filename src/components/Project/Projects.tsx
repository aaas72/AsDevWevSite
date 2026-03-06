import React from "react";
import ProjectCard from "../Cards/ProjectCard";
import Button from "../Button";
import { Link } from "react-router-dom";
import projectsData from "../../../public/data/projects.json";

const Projects: React.FC = () => {


  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-medium text-[#C5C5C5]">Recent Works</h2>
          <span className="text-[#C5C5C5]">2022 — PRESENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsData.projects.slice(-4).reverse().map((project) => (
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

        <div className="flex justify-center mt-12">
          <Link to="/projects">
            <Button variant="outline" size="lg">
              ALL WORKS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
