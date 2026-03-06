import React from "react";
import Button from "../Button";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  imageUrl,
}) => {
  return (
    <Link to={`/project/${id}`} className="block">
      <div className="project-card relative overflow-hidden rounded-lg group cursor-pointer">
        <div className="project-image relative h-[350px] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-130"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1E1E] opacity-50 group-hover:opacity-100 backdrop-filter transition-all duration-300"></div>
        </div>

        <div className="project-content absolute bottom-4 left-0 right-0 p-6 text-[#C5C5C5] transform transition-all duration-300 translate-y-[70%] group-hover:translate-y-0">
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-sm mb-4 opacity-0 group-hover:opacity-90 transition-opacity duration-300">
            {description}
          </p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="outline" size="sm" className="cursor-pointer">
              View Project
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
