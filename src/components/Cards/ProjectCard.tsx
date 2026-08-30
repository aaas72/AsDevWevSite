import React, { useState } from "react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface ProjectCardProps {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  isAdmin,
  onEdit,
  onDelete
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const CardWrapper = isAdmin ? "div" : Link;
  const wrapperProps = isAdmin ? { className: "block h-full cursor-default" } : { to: `/project/${id}`, className: "block h-full" };

  return (
    <CardWrapper {...(wrapperProps as any)}>
      <div className="project-card h-full relative overflow-hidden rounded-[2.5rem] group cursor-pointer border border-white/15 hover:border-white/30 transition-all duration-500">
        <div className="project-image relative h-[350px] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-loader z-10"></div>
          )}
          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1E1E] opacity-50 group-hover:opacity-100 backdrop-filter transition-all duration-300"></div>
        </div>

        <div className="project-content absolute bottom-4 left-0 right-0 p-6 text-[#C5C5C5] transform transition-all duration-300 translate-y-[70%] group-hover:translate-y-0">
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-sm mb-4 opacity-0 group-hover:opacity-90 transition-opacity duration-300 line-clamp-2">
            {description}
          </p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3">
            {isAdmin ? (
              <>
                <Button 
                  variant="secondary"
                  size="sm"
                  icon
                  onClick={(e) => { e.preventDefault(); onEdit?.(); }} 
                >
                  <FiEdit2 />
                </Button>
                <Button 
                  variant="danger"
                  size="sm"
                  icon
                  onClick={(e) => { e.preventDefault(); onDelete?.(); }} 
                >
                  <FiTrash2 />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="cursor-pointer pointer-events-none">
                View Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProjectCard;
