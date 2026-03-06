import React from "react";
import projectsData from "../../../public/data/projects.json";

interface ProjectPageProps {
  projectId?: string;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectId }) => {
  // Find project based on ID
  const project = projectsData.projects.find(
    (p) => p.id === (projectId ? parseInt(projectId) : 0)
  );

  // If project not found, display error message
  if (!project) {
    return (
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-[#C5C5C5]">Project Not Found</h1>
      </div>
    );
  }

  return (
    <div className="project-page">
      {/* Page header with project information */}
      <div className="project-header py-8">
        <div className="container mx-auto px-6">
          {/* Project card */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 mb-8 mt-32">
            <div className="tag inline-block bg-[#2A2A2A] text-sm text-[#C5C5C5] px-3 py-1 rounded-full mb-4">
              {project.category}
            </div>
            <h2 className="text-3xl font-bold text-[#C5C5C5] mb-4">
              {project.title}
            </h2>
            <p className="text-[#919191] mb-4">{project.shortDescription}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl text-[#C5C5C5] mb-3">Services</h3>
                <p className="text-[#919191]">{project.services.join(", ")}</p>
              </div>
              <div>
                <h3 className="text-xl text-[#C5C5C5] mb-3">Website</h3>
                <p className="text-[#919191]">
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {project.website}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large cover image */}
      <div className="project-cover bg-white ">
        <img
          src={project.coverImage}
          alt={`${project.title} Cover`}
          className="w-full h-full object-cover"
          style={{ minHeight: "300px" }} // Default height if image fails to load
        />
      </div>

      {/* Project content */}
      <div className="project-content py-16">
        <div className="container mx-auto px-6">
          {/* Project overview */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">
              Project Overview
            </h2>
            <p className="text-[#919191] leading-relaxed">{project.overview}</p>
          </div>

          {/* Project challenges */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">
              Project Challenges
            </h2>
            <p className="text-[#919191] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          {/* Technical stack */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">
              Technical Stack
            </h2>
            <ul className="list-disc list-inside text-[#919191] space-y-2">
              {project.technicalStack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>

          {/* Results with images */}
          <div>
            <h2 className="text-2xl font-bold text-[#C5C5C5] mb-6">Results</h2>

            {/* Result images */}
            <div className="grid grid-cols-1 gap-8 mt-8">
              {project.results.map((result) => (
                <div
                  key={result.id}
                  className="bg-[#F5F5F5] rounded-lg overflow-hidden"
                >
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-full h-auto"
                    style={{ minHeight: "250px" }} // Default height if image fails to load
                  />
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-medium text-[#2A2A2A] mb-2">
                      {result.title}
                    </h3>
                    <p className="text-[#2A2A2A]">{result.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
