import React from "react";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
}) => {
  return (
    <div className=" p-8 rounded-[2.5rem] border border-white/15 hover:border-white/30 transition-all duration-500 flex flex-col h-full bg-[#171717]">
      <div className="mb-4">
        <span className="text-lg font-medium text-[#C5C5C5]">{id}</span>
      </div>

      <h3 className="text-xl font-medium text-white mb-4">{title}</h3>

      <p className="text-[#C5C5C5] mb-8 flex-grow">{description}</p>
    </div>
  );
};

export default ServiceCard;
