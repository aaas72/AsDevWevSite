import React from "react";

const AboutMe: React.FC = () => {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[35%_auto] items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Profile Image */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="rounded-4xl overflow-hidden shadow-md">
              <img
                src="https://res.cloudinary.com/asdev1/image/upload/v1759454562/myPhoto_jrnt8n.png"
                alt="Profile"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full text-[#474747] mt-6 md:mt-0">
            <div className="space-y-6 sm:space-y-8">
              {/* Headline */}
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1E1E1E]">
                  Transforming Ambitious Ideas into High-Impact Digital Products
                </h2>
                <p className="mt-3 text-sm sm:text-base md:text-lg">
                  I'm a software developer dedicated to building modern web
                  solutions and forging long-term partnerships with businesses
                  ready to innovate and grow.
                </p>
              </div>

              {/* Who I Am */}
              <div>
                <h3 className="text-xl sm:text-2xl font-medium text-[#1E1E1E]">
                  Who I Am
                </h3>
                <div className="mt-3 space-y-4">
                  <p className="text-base sm:text-lg">
                    Driven by a deep passion for technology and a commitment to
                    continuous learning, my mission is to help startups and
                    established businesses thrive in the digital landscape. For
                    me, software development is more than just writing code—it's
                    a craft that blends creative problem-solving with technical
                    excellence to build elegant, functional, and user-centric
                    experiences.
                  </p>
                  <p className="text-base sm:text-lg">
                    I don't just build applications; I build solutions that
                    solve real-world problems, create tangible value for your
                    business, and provide an exceptional user experience for
                    your customers.
                  </p>
                </div>
              </div>

              {/* My Approach */}
              <div>
                <h3 className="text-xl sm:text-2xl font-medium text-[#1E1E1E]">
                  My Approach
                </h3>
                <div className="mt-3 space-y-6">
                  <div>
                    <h4 className="text-lg sm:text-xl font-medium text-[#1E1E1E]">
                      1. Partnership Over Projects
                    </h4>
                    <p className="mt-2 text-base sm:text-lg">
                      I believe the best results come from true collaboration.
                      My goal is to become more than just a developer for you; I
                      aim to be a dedicated technical partner. I take the time
                      to deeply understand your business, your market, and your
                      vision to ensure that every technical decision aligns with
                      your long-term goals. Your success is my success.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-medium text-[#1E1E1E]">
                      2. Communication & Transparency
                    </h4>
                    <p className="mt-2 text-base sm:text-lg">
                      Clear, consistent communication is the backbone of any
                      successful project. You will be kept in the loop at every
                      stage of the development process with regular updates and
                      clear milestones. No surprises, no jargon—just a
                      transparent process that ensures we are always on the same
                      page and moving towards the same goal.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-medium text-[#1E1E1E]">
                      3. Quality & Excellence
                    </h4>
                    <p className="mt-2 text-base sm:text-lg">
                      I am committed to the highest standards of quality. This
                      means writing clean, maintainable, and scalable code that
                      not only functions perfectly today but is also built to
                      adapt and grow in the future. From the user interface to
                      the backend architecture, I deliver robust solutions that
                      are built to last.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Expertise */}
              <div>
                <h3 className="text-xl sm:text-2xl font-medium text-[#1E1E1E]">
                  My Technical Expertise
                </h3>
                <p className="mt-3 text-base sm:text-lg">
                  I specialize in a modern tech stack designed for performance
                  and scalability. My core areas of expertise include:
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-base sm:text-lg">
                  <li>
                    <span className="font-medium">Frontend:</span> React,
                    Next.js, Vue.js, TypeScript, HTML5, CSS3/Sass
                  </li>
                  <li>
                    <span className="font-medium">Backend:</span> Node.js,
                    Express, Python (Django/Flask), REST & GraphQL APIs
                  </li>
                  <li>
                    <span className="font-medium">Databases:</span> PostgreSQL,
                    MongoDB, Firebase
                  </li>
                  <li>
                    <span className="font-medium">Tools & Platforms:</span> Git,
                    Docker, Vercel, AWS, Stripe API
                  </li>
                </ul>
              </div>

              {/* Call to Action */}
              <div>
                <h3 className="text-xl sm:text-2xl font-medium text-[#1E1E1E]">
                  Have a Project in Mind?
                </h3>
                <div className="mt-3 space-y-4">
                  <p className="text-base sm:text-lg">
                    I'm currently available for new projects and collaborations.
                    If you have an idea you're passionate about, a challenge you
                    need to solve, or a business ready to scale, I would love to
                    hear about it.
                  </p>
                  <p className="text-base sm:text-lg">
                    Let's connect and discuss how we can bring your vision to
                    life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
