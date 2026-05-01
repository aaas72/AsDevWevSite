import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FiGithub, FiLinkedin, FiMail, FiPhone, FiGlobe } from "react-icons/fi";

const AboutMe: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .eq("id", 1)
        .single();
      
      if (!error && data) {
        setContent(data);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  if (loading) return (
    <div className="w-full py-32 bg-white text-center text-gray-400 animate-pulse tracking-widest text-xs uppercase">
      Synchronizing Persona...
    </div>
  );

  const display = content || {
    profile_image: "https://res.cloudinary.com/asdev1/image/upload/v1759454562/myPhoto_jrnt8n.png",
    headline: "Transforming Ambitious Ideas into High-Impact Digital Products",
    sub_headline: "I'm a software developer dedicated to building modern web solutions and forging long-term partnerships with businesses ready to innovate and grow.",
    who_i_am_1: "Driven by a deep passion for technology and a commitment to continuous learning, my mission is to help startups and established businesses thrive in the digital landscape.",
    who_i_am_2: "I don't just build applications; I build solutions that solve real-world problems and create tangible value for your business.",
    approach_1_title: "1. Partnership Over Projects",
    approach_1_text: "I believe the best results come from true collaboration. My goal is to become more than just a developer for you; I aim to be a dedicated technical partner.",
    approach_2_title: "2. Communication & Transparency",
    approach_2_text: "Clear, consistent communication is the backbone of any successful project. You will be kept in the loop at every stage.",
    approach_3_title: "3. Quality & Excellence",
    approach_3_text: "I am committed to the highest standards of quality. This means writing clean, maintainable, and scalable code.",
    expertise_text: "I specialize in a modern tech stack designed for performance and scalability.",
    cta_text_1: "I'm currently available for new projects and collaborations.",
    cta_text_2: "Let's connect and discuss how we can bring your vision to life."
  };

  const contactLinks = [
    { icon: <FiGithub />, label: "GitHub", url: display.github_url || "#", value: display.github_url ? display.github_url.split("/").pop() : "GitHub" },
    { icon: <FiLinkedin />, label: "LinkedIn", url: display.linkedin_url || "#", value: display.linkedin_url ? "LinkedIn Profile" : "LinkedIn" },
    { icon: <FiMail />, label: "Email", url: `mailto:${display.email}`, value: display.email || "Email" },
    { icon: <FiPhone />, label: "Phone", url: `tel:${display.phone}`, value: display.phone || "Phone" },
  ];

  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Profile Image Column */}
          <div className="w-full lg:w-1/3 space-y-10">
            <div className="rounded-[2.5rem] overflow-hidden">
              <img
                src={display.profile_image}
                alt="Profile"
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Social & Contact Links */}
            <div className="space-y-4 pt-6">
              <h3 className="text-[10px] font-bold text-[#919191] uppercase tracking-[0.4em] mb-6">Connect</h3>
              <div className="flex flex-col">
                {contactLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-5 group py-4 transition-all duration-300 ${
                      index !== contactLinks.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="text-xl text-[#919191] group-hover:text-black group-hover:scale-110 transition-all duration-300">
                      {link.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#C5C5C5] uppercase tracking-widest">{link.label}</span>
                      <span className="text-sm text-[#919191] group-hover:text-black font-medium transition-colors duration-300">{link.value}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CV Content Column */}
          <div className="w-full lg:w-2/3 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-16 pt-12 lg:pt-0">
            <div className="max-w-3xl space-y-20">
              
              {/* Header / Summary */}
              <header className="space-y-6 overflow-hidden">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-[1.1] break-words">
                  {display.headline}
                </h1>
                <p className="text-xl text-[#666] leading-relaxed italic break-words">
                  {display.sub_headline}
                </p>
              </header>

              {/* Section: Professional Profile */}
              <section className="space-y-6 overflow-hidden">
                <h2 className="text-[10px] font-bold text-[#919191] uppercase tracking-[0.4em] border-b border-gray-100 pb-4">
                  01. Professional Profile
                </h2>
                <div className="text-lg text-[#474747] leading-relaxed space-y-4 break-words">
                  <p>{display.who_i_am_1}</p>
                  <p>{display.who_i_am_2}</p>
                </div>
              </section>

              {/* Section: Technical Expertise */}
              <section className="space-y-6 overflow-hidden">
                <h2 className="text-[10px] font-bold text-[#919191] uppercase tracking-[0.4em] border-b border-gray-100 pb-4">
                  02. Technical Expertise
                </h2>
                <div className="space-y-6">
                  <p className="text-[#474747] leading-relaxed break-words">{display.expertise_text}</p>
                  <div className="flex flex-wrap gap-2">
                    {(display.skills ? display.skills.split(",").map((s: string) => s.trim()) : ["React", "Next.js", "Node.js", "TypeScript"]).map((tech: string) => (
                      <span key={tech} className="px-4 py-1.5 bg-[#F5F5F5] border border-gray-100 rounded-lg text-[10px] font-bold text-[#666] uppercase tracking-widest whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section: Methodology */}
              <section className="space-y-6 overflow-hidden">
                <h2 className="text-[10px] font-bold text-[#919191] uppercase tracking-[0.4em] border-b border-gray-100 pb-4">
                  03. Methodology & Approach
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2 overflow-hidden">
                      <h4 className="text-base font-bold text-[#1A1A1A] break-words">{display[`approach_${i}_title`]}</h4>
                      <p className="text-sm text-[#666] leading-relaxed break-words">{display[`approach_${i}_text`]}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Connect */}
              <footer className="pt-12 border-t border-gray-100 overflow-hidden">
                <div className="space-y-1 break-words max-w-full">
                  <p className="text-sm font-bold text-[#1A1A1A]">{display.cta_text_1}</p>
                  <p className="text-[#666]">{display.cta_text_2}</p>
                </div>
              </footer>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
