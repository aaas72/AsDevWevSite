import React, { useEffect, useState } from "react";
import ProjectCard from "../Cards/ProjectCard";
import Button from "../Button";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-medium text-[#C5C5C5]">Recent Works</h2>
          <span className="text-[#C5C5C5]">2022 — PRESENT</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#C5C5C5]">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                imageUrl={project.image_url}
                projectUrl={project.project_url}
              />
            ))}
          </div>
        )}

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
