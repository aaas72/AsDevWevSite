import React from "react";
import ServiceCard from "./Cards/ServiceCard";

const Services: React.FC = () => {
  const services = [
    {
      id: "01",
      title: "UI/UX Design",
      description:
        "I craft intuitive, beautiful, and user-centric interfaces through wireframing, prototyping, and pixel-perfect design to deliver seamless, goal-driven experiences.",
    },
    {
      id: "02",
      title: "MVP Development",
      description:
        "I turn your concept into a functional MVP focused on core features to validate your idea, gather user feedback, and launch quickly and efficiently.",
    },
    {
      id: "03",
      title: "Custom Web Application Development",
      description:
        "I build robust, scalable, and secure web applications tailored to your business needs, handling backend architecture and frontend implementation end-to-end.",
    },
    {
      id: "04",
      title: "API Development & Integration",
      description:
        "I develop secure RESTful or GraphQL APIs and integrate third-party services to ensure seamless and reliable data flow across your digital ecosystem.",
    },
    {
      id: "05",
      title: "Performance & SEO Optimization",
      description:
        "I optimize speed, responsiveness, and search visibility to boost engagement, conversions, and rankings on Google for existing web applications.",
    },
    {
      id: "06",
      title: "Ongoing Support & Maintenance",
      description:
        "I offer retainer-based support and maintenance to keep your application secure, updated, and running smoothly while you focus on growth.",
    },
  ];

  return (
    <section className="w-full py-16 ">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-medium text-[#C5C5C5]">
            What I Can Do For You
          </h2>
          <span className="text-xl font-medium text-[#C5C5C5]">SERVICES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              id={service.id}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
