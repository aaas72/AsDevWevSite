import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FiChevronDown } from "react-icons/fi";
import Loading from "../Loading";
import TipTapContent from "../TipTapContent";

interface ProjectPageProps {
  projectId?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  overview: string;
  challenge: string;
  services: string[];
  technical_stack: string[];
  image_url: string;
  cover_image: string;
  website: string;
  category: string;
  project_url: string;
  created_at: string;
  results: any[];
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openResults, setOpenResults] = useState<number[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!error && data) {
        setProject(data);
        setOpenResults([]);
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectId]);

  const toggleResult = (index: number) => {
    if (openResults.includes(index)) {
      setOpenResults(openResults.filter(i => i !== index));
    } else {
      setOpenResults([...openResults, index]);
    }
  };

  if (loading) return <Loading />;

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-[#C5C5C5]">Project Not Found</h1>
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && <Loading />}
      <div className={`project-page transition-opacity duration-1000 ${!imageLoaded ? "opacity-0" : "opacity-100"}`}>
      {/* Page header with project information */}
      <div className="project-header py-8">
        <div className="container mx-auto px-6">
          <div className="bg-[#1A1A1A] rounded-3xl p-8 mb-8 mt-32">
            <h2 className="text-4xl font-bold text-[#C5C5C5] mb-4">
              {project.title}
            </h2>
            <p className="text-[#919191] text-lg mb-10 max-w-3xl">{project.short_description || project.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-t border-white/5 pt-10">
              <div>
                <h3 className="text-xl text-[#C5C5C5] mb-3">Field</h3>
                <p className="text-[#919191]">{project.category || "Development"}</p>
              </div>
              <div>
                <h3 className="text-xl text-[#C5C5C5] mb-3">Services</h3>
                <p className="text-[#919191]">{project.services?.join(", ") || "Full Stack"}</p>
              </div>
              <div>
                <h3 className="text-xl text-[#C5C5C5] mb-3">Website</h3>
                <p className="text-[#919191]">
                  {project.website ? (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-300"
                    >
                      Visit Site
                    </a>
                  ) : "Private"}
                </p>
              </div>
              {project.project_url && (
                <div>
                  <h3 className="text-xl text-[#C5C5C5] mb-3">Source</h3>
                  <p className="text-[#919191]">
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-300"
                    >
                      GitHub
                    </a>
                  </p>
                </div>
              )}
              {project.created_at && (
                <div>
                  <h3 className="text-xl text-[#C5C5C5] mb-3">Date</h3>
                  <p className="text-[#919191]">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="project-cover w-full">
        <div className="overflow-hidden">
          <img
            src={project.cover_image || project.image_url}
            alt={`${project.title} Cover`}
            className="w-full h-auto"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </div>
      </div>

      {/* Project content */}
      <div className="project-content py-16">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">Project Overview</h2>
            <TipTapContent content={project.overview || project.description} />
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">Project Challenges</h2>
            <TipTapContent content={project.challenge} />
          </div>

          {/* Results Toggle Cards */}
          {project.results && project.results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">Results</h2>
              <div className="grid grid-cols-1 gap-8 mt-8">
                {project.results.map((result: any, index: number) => {
                  const isOpen = openResults.includes(index);
                  return (
                    <div
                      key={index}
                      className="rounded-3xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => toggleResult(index)}
                        className={`w-full p-6 flex justify-between items-start text-left transition-all duration-500 ease-in-out ${
                          isOpen ? "bg-white" : "bg-[#E2E2E2]"
                        } hover:opacity-95`}
                      >
                        <div className="max-w-3xl">
                          <h3 className="text-xl font-bold mb-3 text-black">
                            {result.title}
                          </h3>
                          <p className="text-[#474747] leading-relaxed">
                            {result.description}
                          </p>
                        </div>
                        <div className={`mt-1 transition-transform duration-500 ease-in-out ${isOpen ? "rotate-180 text-black" : "rotate-0 text-gray-600"}`}>
                          <FiChevronDown size={28} />
                        </div>
                      </button>

                      <div 
                        className={`grid transition-all duration-500 ease-in-out bg-white ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <img
                            src={result.imageUrl}
                            alt={result.title}
                            className="w-full h-auto"
                            style={{ minHeight: "250px" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
  );
};

export default ProjectPage;
