import React, { useEffect, useState } from "react";
import ProjectCard from "../Cards/ProjectCard";
import Button from "../Button";
import { Link } from "react-router-dom";
import { projectService } from "../../services";
import Loading from "../Loading";
import type { Project } from "../../types";
import { useScrollReveal } from "../../hooks";
import { ScrollReveal } from "../ScrollReveal/ScrollReveal";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: sectionRef, isVisible, scrollDir } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: "-20px 0px -50px 0px",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getRecent(4);
        setProjects(data);
      } catch (err) {
        console.error("Error fetching recent projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Reusable Direction-Aware Header */}
        <ScrollReveal.Header
          title="Recent Works"
          badge="2022 — PRESENT"
          isVisible={isVisible}
          scrollDir={scrollDir}
        />

        {loading ? (
          <Loading />
        ) : (
          /* Cards Grid with Reusable 3D Stagger Entrance */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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

        {/* Reusable Action Button with Directional Reveal */}
        <ScrollReveal.Action
          isVisible={isVisible}
          scrollDir={scrollDir}
          delayMs={550}
        >
          <Link to="/projects">
            <Button variant="outline" size="lg">
              ALL WORKS
            </Button>
          </Link>
        </ScrollReveal.Action>
      </div>
    </section>
  );
};

export default Projects;
