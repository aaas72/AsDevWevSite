import React, { useEffect, useState } from "react";
import ProjectCard from "../Cards/ProjectCard";
import { projectService } from "../../services";
import Loading from "../Loading";
import type { Project } from "../../types";
import { useScrollReveal } from "../../hooks";
import { ScrollReveal } from "../ScrollReveal/ScrollReveal";

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: sectionRef, isVisible, scrollDir } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: "-20px 0px -50px 0px",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching all projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ScrollReveal.Item
                key={project.id}
                index={index}
                totalColumns={2}
                isVisible={isVisible}
                scrollDir={scrollDir}
              >
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.image_url}
                  projectUrl={project.project_url}
                />
              </ScrollReveal.Item>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProjects;
