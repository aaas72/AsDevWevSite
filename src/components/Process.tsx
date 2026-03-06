import React from "react";

const Process: React.FC = () => {
  const processSteps = [
    {
      id: 1,
      title: "01 — Discovery & Research",
      description:
        "We start with a deep dive into your business goals, target audience, and competitors. This phase ensures we build the project on a solid strategic foundation.",
    },
    {
      id: 2,
      title: "02 — Planning & Strategy",
      description:
        "Based on the discovery phase, we create a detailed project plan, define the sitemap and architecture, and select the right technologies to ensure an efficient and organized workflow.",
    },
    {
      id: 3,
      title: "03 — UI/UX Design",
      description:
        "We turn ideas into tangible designs, starting with wireframes, then moving to visually stunning UI designs and interactive prototypes to guarantee the best user experience.",
    },
    {
      id: 4,
      title: "04 — Development",
      description:
        "We transform the approved designs into a live, interactive website or application, writing clean, efficient, and scalable code that is responsive across all devices.",
    },
    {
      id: 5,
      title: "05 — Testing & Launch",
      description:
        "Before going live, we conduct comprehensive testing on every part of the project to ensure it is bug-free and performs perfectly, then proceed with a smooth and official launch.",
    },
    {
      id: 6,
      title: "06 — Support & Growth",
      description:
        "Our work doesn’t end at launch. We provide ongoing technical support, perform regular maintenance, and analyze performance to recommend future improvements that help your business grow.",
    },
  ];

  return (
    <section className="relative w-full py-16 ">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-medium text-[#C5C5C5]">
            Process Delivers Value
          </h2>
          <span className="text-[#C5C5C5]">THE APPROACH</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="process-step p-6  border-l-2   border-[#6c6c6c]"
            >
              <h3 className="text-lg font-medium text-[#ffffff] mb-4">
                {step.title}
              </h3>
              <p className="text-sm text-[#A0A0A0]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
