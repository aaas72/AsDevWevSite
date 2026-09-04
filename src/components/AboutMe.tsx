import React, { useEffect, useState } from "react";
import { aboutService } from "../services";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiExternalLink,
  FiGlobe,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import type {
  Education,
  WorkExperience,
  ProjectHighlight,
  SkillCategory,
  Language,
  Methodology,
  CustomCvData,
  AboutContent,
} from "../types";

const AboutMe: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await aboutService.get();
        if (data) {
          setContent(data);
        }
      } catch (err) {
        console.error("Error fetching about content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Parse structured dynamic CV data directly from database
  let customCv: CustomCvData | null = null;
  if (content?.cta_text_2) {
    try {
      customCv = JSON.parse(content.cta_text_2);
    } catch (e) {
      console.error("Error parsing dynamic CV data:", e);
    }
  }

  const display = {
    profile_image: content?.profile_image || "",
    name: "Abdellah Sheikh",
    headline: content?.headline || "",
    sub_headline: content?.sub_headline || "",
    who_i_am_1: content?.who_i_am_1 || "",
    who_i_am_2: content?.who_i_am_2 || "",
    email: content?.email || "",
    phone: content?.phone || "",
    location: customCv?.location || "",
    github_url: content?.github_url || "",
    linkedin_url: content?.linkedin_url || "",
    website: customCv?.website || "",
    cv_url: customCv?.cv_url || "",
  };

  const workExperience: WorkExperience[] = customCv?.workExperience || [];
  const education: Education = customCv?.education || {
    degree: "",
    university: "",
    location: "",
    period: "",
    focus: "",
  };
  const featuredProjects: ProjectHighlight[] = customCv?.featuredProjects || [];
  const skillCategories: SkillCategory[] = customCv?.skillCategories || [];
  const languages: Language[] = customCv?.languages || [];
  const softSkills: string[] = customCv?.softSkills || [];
  const methodologies: Methodology[] = customCv?.methodologies || [];

  const contactLinks = [
    {
      icon: <FiMail />,
      label: "Email",
      url: display.email ? `mailto:${display.email}` : "#",
      value: display.email,
    },
    {
      icon: <FiPhone />,
      label: "Phone",
      url: display.phone ? `tel:${display.phone}` : "#",
      value: display.phone,
    },
    {
      icon: <FiMapPin />,
      label: "Location",
      url: "#",
      value: display.location,
    },
    {
      icon: <FiLinkedin />,
      label: "LinkedIn",
      url: display.linkedin_url || "#",
      value: display.linkedin_url
        ? display.linkedin_url.replace("https://www.", "").replace("https://", "")
        : "",
    },
    {
      icon: <FiGithub />,
      label: "GitHub",
      url: display.github_url || "#",
      value: display.github_url
        ? display.github_url.replace("https://github.com/", "@")
        : "",
    },
    {
      icon: <FiGlobe />,
      label: "Website",
      url: display.website || "#",
      value: display.website ? display.website.replace("https://", "") : "",
    },
  ].filter((link) => link.value);

  // List of active CV sections preserving exact original structure
  const sectionList: { id: string; num: string; render: () => React.ReactNode }[] = [];

  if (display.who_i_am_1 || display.who_i_am_2) {
    sectionList.push({
      id: "sec-01",
      num: "01.",
      render: () => (
        <section className="space-y-4">
          <div className="flex items-center gap-3.5 border-b border-gray-200 pb-3.5">
            <span className="text-base sm:text-lg font-black text-black tracking-[0.25em]">
              01.
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111] uppercase tracking-[0.25em]">
              Professional Profile
            </h2>
          </div>
          <div className="text-[17px] sm:text-[18px] text-[#222] leading-[1.45] space-y-2">
            {display.who_i_am_1 && <p>{display.who_i_am_1}</p>}
            {display.who_i_am_2 && <p>{display.who_i_am_2}</p>}
          </div>
        </section>
      ),
    });
  }

  if (education.degree) {
    sectionList.push({
      id: "sec-02",
      num: "02.",
      render: () => (
        <section className="space-y-4">
          <div className="flex items-center gap-3.5 border-b border-gray-200 pb-3.5">
            <span className="text-base sm:text-lg font-black text-black tracking-[0.25em]">
              02.
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111] uppercase tracking-[0.25em]">
              Education & Academic Background
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-1">
                <h3 className="text-xl font-bold text-[#111]">{education.degree}</h3>
                {education.period && (
                  <span className="text-sm font-semibold text-neutral-500">
                    {education.period}
                  </span>
                )}
              </div>

              {(education.university || education.location) && (
                <p className="text-[16px] font-semibold text-neutral-700 mb-2">
                  {education.university}{" "}
                  {education.location && (
                    <>
                      —{" "}
                      <span className="text-neutral-500 font-normal">
                        {education.location}
                      </span>
                    </>
                  )}
                </p>
              )}

              {education.focus && (
                <p className="text-[17px] sm:text-[18px] text-[#222] leading-[1.45]">
                  {education.focus}
                </p>
              )}
            </div>
          </div>
        </section>
      ),
    });
  }

  if (workExperience.length > 0) {
    sectionList.push({
      id: "sec-03",
      num: "03.",
      render: () => (
        <section className="space-y-4">
          <div className="flex items-center gap-3.5 border-b border-gray-200 pb-3.5">
            <span className="text-base sm:text-lg font-black text-black tracking-[0.25em]">
              03.
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111] uppercase tracking-[0.25em]">
              Work Experience
            </h2>
          </div>

          <div className="space-y-6">
            {workExperience.map((exp, index) => (
              <div key={index} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold text-[#111]">{exp.role}</h3>
                  {exp.period && (
                    <span className="text-sm font-semibold text-neutral-500">
                      {exp.period}
                    </span>
                  )}
                </div>

                {(exp.company || exp.location) && (
                  <p className="text-[16px] font-semibold text-neutral-700">
                    {exp.company}{" "}
                    {exp.location && (
                      <>
                        —{" "}
                        <span className="text-neutral-500 font-normal">
                          {exp.location}
                        </span>
                      </>
                    )}
                  </p>
                )}

                {exp.points && exp.points.length > 0 && (
                  <ul className="space-y-2 pt-0.5">
                    {exp.points.map((point, pIndex) => (
                      <li
                        key={pIndex}
                        className="text-[17px] sm:text-[18px] text-[#222] leading-[1.45] flex items-start gap-3"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Stack Chips */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    });
  }

  if (featuredProjects.length > 0) {
    sectionList.push({
      id: "sec-04",
      num: "04.",
      render: () => (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3.5">
            <div className="flex items-center gap-3.5">
              <span className="text-base sm:text-lg font-black text-black tracking-[0.25em]">
                04.
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#111] uppercase tracking-[0.25em]">
                Key Engineered Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-xs font-bold text-neutral-600 hover:text-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <span>View All Projects</span>
              <FiExternalLink className="text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {featuredProjects.map((proj, idx) => {
              const isLeft = idx % 2 === 0;
              const isTop = idx < 2;
              return (
                <div
                  key={idx}
                  className={`space-y-3 ${
                    isTop
                      ? "pb-8 md:pb-8 md:border-b border-gray-200"
                      : "pt-8 md:pt-8"
                  } ${
                    isLeft
                      ? "md:pr-8 md:border-r border-gray-200"
                      : "md:pl-8"
                  } ${
                    idx !== 0 && !isTop
                      ? "border-t border-gray-200 md:border-t-0"
                      : ""
                  } ${
                    idx === 1
                      ? "border-t border-gray-200 md:border-t-0 pt-8 md:pt-0"
                      : ""
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      {proj.tagline && (
                        <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                          {proj.tagline}
                        </span>
                      )}
                      {proj.badge && (
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                          {proj.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#111]">
                      {proj.title}
                    </h3>

                    {proj.description && (
                      <p className="text-[17px] sm:text-[18px] text-[#222] leading-[1.45]">
                        {proj.description}
                      </p>
                    )}

                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="space-y-1.5 pt-1">
                        {proj.highlights.map((h, hIdx) => (
                          <li
                            key={hIdx}
                            className="text-[15.5px] text-neutral-700 flex items-start gap-2 leading-[1.45]"
                          >
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ),
    });
  }

  if (skillCategories.length > 0) {
    sectionList.push({
      id: "sec-05",
      num: "05.",
      render: () => (
        <section className="space-y-4">
          <div className="flex items-center gap-3.5 border-b border-gray-200 pb-3.5">
            <span className="text-base sm:text-lg font-black text-black tracking-[0.25em]">
              05.
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111] uppercase tracking-[0.25em]">
              Technical Skill Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="space-y-2.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#111]">
                  {cat.title}
                </h4>

                {cat.skills && cat.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-neutral-100 rounded-md text-[13px] font-medium text-[#222]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    });
  }

  if (languages.length > 0 || softSkills.length > 0) {
    sectionList.push({
      id: "sec-06",
      num: "06.",
      render: () => (
        <section className="space-y-4">
          <div className="flex items-center gap-3.5 border-b border-gray-200 pb-3.5">
            <span className="text-base sm:text-lg font-black text-black tracking-[0.25em]">
              06.
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111] uppercase tracking-[0.25em]">
              Languages & Professional Skills
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Spoken Languages */}
            {languages.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111]">
                  Language Proficiency
                </h3>

                <div className="space-y-1.5">
                  {languages.map((lang, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-baseline gap-2.5 text-[16px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0 self-center" />
                      <span className="font-bold text-[#111]">
                        {lang.name}
                      </span>
                      {lang.level && (
                        <>
                          <span className="text-neutral-400 font-normal">—</span>
                          <span className="text-neutral-600 font-normal">
                            {lang.level}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional & Soft Skills */}
            {softSkills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111]">
                  Professional Competencies
                </h3>

                <div className="grid grid-cols-1 gap-2">
                  {softSkills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center gap-2.5 text-[16px] text-[#222]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />
                      <span className="font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ),
    });
  }

  if (methodologies.length > 0) {
    sectionList.push({
      id: "sec-07",
      num: "07.",
      render: () => (
        <section className="space-y-4">
          <div className="flex items-center gap-3.5 border-b border-gray-200 pb-3.5">
            <span className="text-base sm:text-lg font-black text-black tracking-[0.25em]">
              07.
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111] uppercase tracking-[0.25em]">
              Methodology & Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methodologies.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-[17px] font-bold text-[#111]">
                  {m.title}
                </h4>
                <p className="text-[15px] text-[#444] leading-[1.45]">
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          {/* Final Footer CTA with Action Buttons */}
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-bold text-[#111]">
                Interested in collaborating or hiring?
              </p>
              <p className="text-sm text-[#666]">
                Let's discuss how we can bring your next idea to reality.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {display.cv_url && (
                <a
                  href={display.cv_url}
                  download="ABDELLAHSHEIKH_CV.docx"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-black text-white font-medium text-xs uppercase tracking-widest hover:bg-neutral-800 active:scale-[0.99] transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <FiDownload className="text-sm group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Download CV</span>
                </a>
              )}

              <Link
                to="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[#1A1A1A] font-medium text-xs uppercase tracking-widest hover:bg-gray-100 active:scale-[0.99] transition-all duration-300"
              >
                <span>Get In Touch</span>
                <FiExternalLink className="text-xs" />
              </Link>
            </div>
          </div>
        </section>
      ),
    });
  }

  if (loading) return <Loading />;

  return (
    <section
      data-theme="light"
      className="relative w-full min-h-screen bg-white text-[#1A1A1A] py-12 sm:py-16 md:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Sticky Responsive Profile Card & Connect Links */}
          {/* ============================================================ */}
          <aside className="w-full lg:w-[260px] xl:w-[280px] flex-shrink-0 lg:sticky lg:top-28 self-start space-y-6 pb-6 lg:pb-0 border-b lg:border-b-0 border-gray-100">
            <div className="space-y-4">
              {/* Profile Image & Name */}
              <div className="flex lg:flex-col items-center lg:items-start gap-4">
                {display.profile_image && (
                  <div className="group relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200/80 shadow-sm transition-all duration-500 hover:shadow-lg aspect-square w-20 h-20 lg:w-full lg:h-auto flex-shrink-0">
                    <img
                      src={display.profile_image}
                      alt={display.name}
                      className="w-full h-full object-cover object-top grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <p className="text-[#111] text-lg lg:text-base font-bold tracking-tight truncate">
                    {display.name}
                  </p>
                  <p className="text-[#666] text-xs font-medium mt-0.5">
                    Software Engineer
                  </p>
                </div>
              </div>

              {/* Connect & Contact Information */}
              {contactLinks.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-[10px] font-bold text-[#919191] uppercase tracking-[0.25em]">
                    Direct Connect
                  </h3>
                  <div className="flex flex-row lg:flex-col flex-wrap gap-2 lg:gap-0 lg:divide-y lg:divide-gray-100">
                    {contactLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target={
                          link.url.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 lg:gap-3.5 group py-1.5 lg:py-2.5 transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200/80 flex items-center justify-center text-xs lg:text-sm text-[#737373] group-hover:text-black group-hover:border-black group-hover:bg-white group-hover:shadow-sm transition-all duration-300 flex-shrink-0">
                          {link.icon}
                        </div>
                        <div className="hidden lg:flex flex-col min-w-0">
                          <span className="text-[9px] font-bold text-[#A3A3A3] uppercase tracking-wider">
                            {link.label}
                          </span>
                          <span className="text-[13px] sm:text-sm text-[#111] font-semibold group-hover:text-black transition-colors duration-300 truncate">
                            {link.value}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Full Flowing Direct CV Display                 */}
          {/* ============================================================ */}
          <main className="w-full lg:flex-1 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-10 pt-8 lg:pt-0 space-y-12 sm:space-y-16">
            
            {/* Header Intro Summary */}
            {(display.headline || display.sub_headline) && (
              <header className="space-y-3 pb-6 border-b border-gray-100">
                {display.headline && (
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111] leading-[1.15]">
                    {display.headline}
                  </h1>
                )}
                {display.sub_headline && (
                  <p className="text-base sm:text-lg md:text-xl text-[#444] leading-[1.5] font-normal">
                    {display.sub_headline}
                  </p>
                )}
              </header>
            )}

            {/* Direct Sections Sequence */}
            <div className="space-y-12 sm:space-y-16">
              {sectionList.map((sec) => (
                <div key={sec.id} className="w-full">
                  {sec.render()}
                </div>
              ))}
            </div>

          </main>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
