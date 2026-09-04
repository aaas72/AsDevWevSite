import React, { useEffect, useState } from "react";
import { projectService } from "../../services";
import { FiChevronDown } from "react-icons/fi";
import Loading from "../Loading";
import TipTapContent from "../TipTapContent";
import type { Project } from "../../types";

interface ProjectPageProps {
  projectId?: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openResults, setOpenResults] = useState<number[]>([0]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const data = await projectService.getById(projectId);
        if (data) {
          setProject(data);
          setOpenResults([0]);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const toggleResult = (index: number) => {
    if (openResults.includes(index)) {
      setOpenResults(openResults.filter((i) => i !== index));
    } else {
      setOpenResults([...openResults, index]);
    }
  };

  const toggleAllResults = () => {
    if (!project?.results) return;
    if (openResults.length === project.results.length) {
      setOpenResults([]);
    } else {
      setOpenResults(project.results.map((_, i) => i));
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

          {project.challenge && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">Project Challenges</h2>
              <TipTapContent content={project.challenge} />
            </div>
          )}

          {/* Results Toggle Cards */}
          {project.results && project.results.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#C5C5C5]">Results & Detail Sections</h2>
                  <p className="text-sm text-[#919191] mt-1">Detailed case studies, system walkthroughs, and deliverables</p>
                </div>
                {project.results.length > 1 && (
                  <button
                    type="button"
                    onClick={toggleAllResults}
                    className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#C5C5C5] hover:text-white transition-all cursor-pointer border border-white/10"
                  >
                    {openResults.length === project.results.length ? "Collapse All" : "Expand All"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-8 mt-6">
                {project.results.map((result, index) => {
                  const isOpen = openResults.includes(index);
                  return (
                    <div
                      key={index}
                      className="rounded-3xl overflow-hidden transition-all duration-300 shadow-sm border border-neutral-200/60 bg-white"
                    >
                      {/* Interactive Card Header Bar */}
                      <button
                        type="button"
                        onClick={() => toggleResult(index)}
                        aria-expanded={isOpen}
                        className={`w-full p-6 sm:p-7 flex justify-between items-center text-left transition-all duration-300 ${
                          isOpen ? "bg-white border-b border-gray-100" : "bg-[#EAEAEA] hover:bg-[#E2E2E2]"
                        } cursor-pointer group`}
                      >
                        <div className="flex items-center gap-3.5 pr-4 min-w-0">
                          <span
                            className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                              isOpen ? "bg-black text-white" : "bg-neutral-800 text-white"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight group-hover:text-neutral-700 transition-colors">
                            {result.title}
                          </h3>
                        </div>
                        <div
                          className={`p-2 rounded-full transition-all duration-300 ${
                            isOpen
                              ? "rotate-180 bg-neutral-100 text-black"
                              : "rotate-0 text-neutral-600 group-hover:bg-white/80"
                          }`}
                        >
                          <FiChevronDown size={22} />
                        </div>
                      </button>

                      {/* Expandable Article Body & Media */}
                      <div
                        className={`grid transition-all duration-500 ease-in-out bg-white ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-6 sm:p-8 lg:p-10 space-y-8 bg-white">
                            {/* Rich Article Formatted Text */}
                            {result.description && (
                              <article className="max-w-none">
                                <TipTapContent
                                  content={result.description}
                                  className="result-article-prose"
                                />
                              </article>
                            )}

                            {/* Result Media / Screenshot */}
                            {result.imageUrl && (
                              <div className="rounded-2xl overflow-hidden border border-gray-200/80 shadow-md bg-neutral-950">
                                <img
                                  src={result.imageUrl}
                                  alt={result.title}
                                  className="w-full h-auto object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                          </div>
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
