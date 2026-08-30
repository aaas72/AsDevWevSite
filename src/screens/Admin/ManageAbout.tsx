import React, { useEffect, useState } from "react";
import { aboutService, storageService } from "../../services";
import {
  FiSave,
  FiUploadCloud,
  FiUser,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiGlobe,
  FiBookOpen,
  FiBriefcase,
  FiLayers,
  FiCheckCircle,
  FiCpu,
  FiEye,
} from "react-icons/fi";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { useAlert } from "../../context/AlertContext";
import type {
  Education as EducationItem,
  WorkExperience as WorkExpItem,
  ProjectHighlight as ProjectItem,
  SkillCategory as SkillCategoryItem,
  Language as LanguageItem,
  Methodology as MethodologyItem,
  CustomCvData,
} from "../../types";

const ManageAbout: React.FC = () => {
  const { toast } = useAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "basic" | "education" | "experience" | "projects" | "skills" | "languages" | "methodology"
  >("basic");

  // Basic Information
  const [formData, setFormData] = useState({
    profile_image: "",
    headline: "",
    sub_headline: "",
    who_i_am_1: "",
    who_i_am_2: "",
    github_url: "",
    linkedin_url: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    cv_url: "",
  });

  // CV Sections state (Loaded from Database)
  const [education, setEducation] = useState<EducationItem>({
    degree: "",
    university: "",
    location: "",
    period: "",
    focus: "",
  });
  const [workExperience, setWorkExperience] = useState<WorkExpItem[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategoryItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [methodologies, setMethodologies] = useState<MethodologyItem[]>([]);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    setLoading(true);
    try {
      const data = await aboutService.get();

      if (data) {
        let cvObj: CustomCvData | null = null;
        if (data.cta_text_2) {
          try {
            cvObj = JSON.parse(data.cta_text_2);
          } catch (e) {
            console.error("Error parsing dynamic CV JSON:", e);
          }
        }

        setFormData({
          profile_image: data.profile_image || "",
          headline: data.headline || "",
          sub_headline: data.sub_headline || "",
          who_i_am_1: data.who_i_am_1 || "",
          who_i_am_2: data.who_i_am_2 || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          email: data.email || "",
          phone: data.phone || "",
          location: cvObj?.location || "",
          website: cvObj?.website || "",
          cv_url: cvObj?.cv_url || "",
        });

        if (cvObj?.education) setEducation(cvObj.education);
        if (cvObj?.workExperience) setWorkExperience(cvObj.workExperience);
        if (cvObj?.featuredProjects) setFeaturedProjects(cvObj.featuredProjects);
        if (cvObj?.skillCategories) setSkillCategories(cvObj.skillCategories);
        if (cvObj?.languages) setLanguages(cvObj.languages);
        if (cvObj?.softSkills) setSoftSkills(cvObj.softSkills);
        if (cvObj?.methodologies) setMethodologies(cvObj.methodologies);
      }
    } catch (err) {
      console.error("Error fetching about content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cvJson = JSON.stringify({
        education,
        workExperience,
        featuredProjects,
        skillCategories,
        languages,
        softSkills,
        methodologies,
        location: formData.location,
        website: formData.website,
        cv_url: formData.cv_url,
      });

      const payload = {
        id: 1,
        profile_image: formData.profile_image,
        headline: formData.headline,
        sub_headline: formData.sub_headline,
        who_i_am_1: formData.who_i_am_1,
        who_i_am_2: formData.who_i_am_2,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        email: formData.email,
        phone: formData.phone,
        cta_text_2: cvJson,
        updated_at: new Date().toISOString(),
      };

      await aboutService.upsert(payload);
      toast.success("CV & Profile updated successfully in Database!", "Saved Successfully");
    } catch (err: any) {
      toast.error("Error saving: " + err.message, "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const publicUrl = await storageService.uploadImage(file, "about");

      setFormData({ ...formData, profile_image: publicUrl });
      toast.success("Profile image uploaded successfully!", "Upload Complete");
    } catch (error: any) {
      toast.error("Error uploading image: " + error.message, "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto">
      {/* Top Header & Save Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            CV & Profile Customizer
          </h2>
          <p className="text-[#919191] text-sm mt-1.5 font-medium">
            Completely manage your live CV, projects, experience, skills, and personal information directly from the database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/#/about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-bold tracking-wider uppercase transition-all"
          >
            <FiEye /> View Live CV
          </a>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3.5 bg-white text-black font-bold tracking-widest text-xs rounded-xl shadow-lg hover:bg-neutral-200 active:scale-95 transition-all"
          >
            <FiSave className="mr-2 text-base inline" /> {saving ? "SAVING..." : "SAVE CHANGES"}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs for CV Sections */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-none">
        {[
          { id: "basic", label: "01. Persona & Links", icon: <FiUser /> },
          { id: "education", label: "02. Education", icon: <FiBookOpen /> },
          { id: "experience", label: "03. Experience", icon: <FiBriefcase /> },
          { id: "projects", label: "04. Projects", icon: <FiLayers /> },
          { id: "skills", label: "05. Skill Matrix", icon: <FiCpu /> },
          { id: "languages", label: "06. Languages & Soft Skills", icon: <FiGlobe /> },
          { id: "methodology", label: "07. Methodology", icon: <FiCheckCircle /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-white text-black shadow-md"
                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content Panels */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* ============================================================ */}
        {/* TAB 01: Persona & Direct Connect Links                        */}
        {/* ============================================================ */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Avatar Frame */}
            <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-6 text-center h-fit">
              <div className="w-44 h-44 mx-auto rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl relative group bg-neutral-900 aspect-square">
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    className="w-full h-full object-cover object-top"
                    alt="Profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-700">
                    <FiUser />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                  <FiUploadCloud className="text-3xl text-white mb-2" />
                  <span className="text-xs text-white font-medium">Change Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Profile Photo</h3>
                <p className="text-xs text-[#919191] mt-1">1:1 Square recommended</p>
              </div>

              {/* CV File Link */}
              <div className="pt-4 border-t border-white/10 text-left space-y-2">
                <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                  CV Download File URL
                </label>
                <input
                  value={formData.cv_url}
                  onChange={(e) => setFormData({ ...formData, cv_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#C5C5C5] outline-none focus:border-white/40"
                  placeholder="/CV/ABDELLAHSHEIKH.docx"
                />
              </div>
            </div>

            {/* Headline, Subheadline & Bio */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-5">
                <h3 className="text-base font-bold text-white tracking-wide">Headline & Intro</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Main Headline
                    </label>
                    <input
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-lg outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Sub-Headline
                    </label>
                    <textarea
                      rows={2}
                      value={formData.sub_headline}
                      onChange={(e) => setFormData({ ...formData, sub_headline: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-neutral-300 text-sm outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-5">
                <h3 className="text-base font-bold text-white tracking-wide">Section 01: Professional Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={formData.who_i_am_1}
                      onChange={(e) => setFormData({ ...formData, who_i_am_1: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-neutral-200 text-sm outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={formData.who_i_am_2}
                      onChange={(e) => setFormData({ ...formData, who_i_am_2: e.target.value })}
                      className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-neutral-200 text-sm outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Connect Contacts */}
              <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-5">
                <h3 className="text-base font-bold text-white tracking-wide">Direct Connect Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <FiMail /> Email
                    </label>
                    <input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-neutral-200 outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <FiPhone /> Phone
                    </label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-neutral-200 outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <FiGithub /> GitHub Profile URL
                    </label>
                    <input
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-neutral-200 outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <FiLinkedin /> LinkedIn Profile URL
                    </label>
                    <input
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-neutral-200 outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <FiGlobe /> Location
                    </label>
                    <input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-neutral-200 outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <FiGlobe /> Website URL
                    </label>
                    <input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full mt-1.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-neutral-200 outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 02: Education                                            */}
        {/* ============================================================ */}
        {activeTab === "education" && (
          <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-bold text-white tracking-wide">
              02. Education & Academic Background
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                  Degree Title
                </label>
                <input
                  value={education.degree}
                  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold outline-none focus:border-white/40"
                  placeholder="e.g. Bachelor of Software Engineering"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                  Period / Years
                </label>
                <input
                  value={education.period}
                  onChange={(e) => setEducation({ ...education, period: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/40"
                  placeholder="e.g. 2022 – 2026"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                  University Name
                </label>
                <input
                  value={education.university}
                  onChange={(e) => setEducation({ ...education, university: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/40"
                  placeholder="e.g. Firat University"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                  Location
                </label>
                <input
                  value={education.location}
                  onChange={(e) => setEducation({ ...education, location: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/40"
                  placeholder="e.g. Elazig, Türkiye"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                Focus & Key Areas
              </label>
              <textarea
                rows={3}
                value={education.focus}
                onChange={(e) => setEducation({ ...education, focus: e.target.value })}
                className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-neutral-200 text-sm outline-none focus:border-white/40 leading-relaxed"
                placeholder="Core focus on Software Architecture..."
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 03: Work Experience                                      */}
        {/* ============================================================ */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white tracking-wide">
                03. Professional Work Experience
              </h3>
              <Button
                type="button"
                onClick={() =>
                  setWorkExperience([
                    ...workExperience,
                    {
                      role: "",
                      company: "",
                      location: "",
                      period: "",
                      points: [""],
                      technologies: [],
                    },
                  ])
                }
                variant="primary"
                size="sm"
                className="gap-2 uppercase tracking-wider"
              >
                <FiPlus /> Add Position
              </Button>
            </div>

            <div className="space-y-6">
              {workExperience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Position #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      onClick={() => setWorkExperience(workExperience.filter((_, i) => i !== idx))}
                      variant="ghost"
                      size="xs"
                      icon
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                        Role Title
                      </label>
                      <input
                        value={exp.role}
                        onChange={(e) => {
                          const copy = [...workExperience];
                          copy[idx].role = e.target.value;
                          setWorkExperience(copy);
                        }}
                        className="w-full mt-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                        Company Name
                      </label>
                      <input
                        value={exp.company}
                        onChange={(e) => {
                          const copy = [...workExperience];
                          copy[idx].company = e.target.value;
                          setWorkExperience(copy);
                        }}
                        className="w-full mt-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                        Period
                      </label>
                      <input
                        value={exp.period}
                        onChange={(e) => {
                          const copy = [...workExperience];
                          copy[idx].period = e.target.value;
                          setWorkExperience(copy);
                        }}
                        className="w-full mt-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                        Location
                      </label>
                      <input
                        value={exp.location}
                        onChange={(e) => {
                          const copy = [...workExperience];
                          copy[idx].location = e.target.value;
                          setWorkExperience(copy);
                        }}
                        className="w-full mt-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Bullet Points (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={exp.points.join("\n")}
                      onChange={(e) => {
                        const copy = [...workExperience];
                        copy[idx].points = e.target.value.split("\n").filter((p) => p.trim() !== "");
                        setWorkExperience(copy);
                      }}
                      className="w-full mt-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-neutral-200 text-sm outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Technologies Used (Comma separated)
                    </label>
                    <input
                      value={exp.technologies.join(", ")}
                      onChange={(e) => {
                        const copy = [...workExperience];
                        copy[idx].technologies = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                        setWorkExperience(copy);
                      }}
                      className="w-full mt-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 04: Key Engineered Projects                              */}
        {/* ============================================================ */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white tracking-wide">
                04. Key Engineered Projects (2x2 Grid)
              </h3>
              <Button
                type="button"
                onClick={() =>
                  setFeaturedProjects([
                    ...featuredProjects,
                    {
                      title: "",
                      tagline: "",
                      badge: "",
                      description: "",
                      highlights: [],
                      techStack: [],
                    },
                  ])
                }
                variant="primary"
                size="sm"
                className="gap-2 uppercase tracking-wider"
              >
                <FiPlus /> Add Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Project #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      onClick={() => setFeaturedProjects(featuredProjects.filter((_, i) => i !== idx))}
                      variant="ghost"
                      size="xs"
                      icon
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                        Tagline / Category
                      </label>
                      <input
                        value={proj.tagline}
                        onChange={(e) => {
                          const copy = [...featuredProjects];
                          copy[idx].tagline = e.target.value;
                          setFeaturedProjects(copy);
                        }}
                        className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                        Badge (Optional)
                      </label>
                      <input
                        value={proj.badge || ""}
                        onChange={(e) => {
                          const copy = [...featuredProjects];
                          copy[idx].badge = e.target.value;
                          setFeaturedProjects(copy);
                        }}
                        className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Project Title
                    </label>
                    <input
                      value={proj.title}
                      onChange={(e) => {
                        const copy = [...featuredProjects];
                        copy[idx].title = e.target.value;
                        setFeaturedProjects(copy);
                      }}
                      className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => {
                        const copy = [...featuredProjects];
                        copy[idx].description = e.target.value;
                        setFeaturedProjects(copy);
                      }}
                      className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-200 text-xs outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Highlights (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={proj.highlights.join("\n")}
                      onChange={(e) => {
                        const copy = [...featuredProjects];
                        copy[idx].highlights = e.target.value.split("\n").filter((p) => p.trim() !== "");
                        setFeaturedProjects(copy);
                      }}
                      className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-300 text-xs outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Tech Stack (Comma separated)
                    </label>
                    <input
                      value={proj.techStack.join(", ")}
                      onChange={(e) => {
                        const copy = [...featuredProjects];
                        copy[idx].techStack = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                        setFeaturedProjects(copy);
                      }}
                      className="w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-white/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 05: Technical Skill Matrix                               */}
        {/* ============================================================ */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white tracking-wide">
                05. Technical Skill Matrix
              </h3>
              <Button
                type="button"
                onClick={() =>
                  setSkillCategories([
                    ...skillCategories,
                    {
                      title: "",
                      skills: [],
                    },
                  ])
                }
                variant="primary"
                size="sm"
                className="gap-2 uppercase tracking-wider"
              >
                <FiPlus /> Add Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <input
                      value={cat.title}
                      onChange={(e) => {
                        const copy = [...skillCategories];
                        copy[idx].title = e.target.value;
                        setSkillCategories(copy);
                      }}
                      className="bg-transparent text-white font-bold text-sm uppercase tracking-wider outline-none focus:border-b border-white"
                      placeholder="Category Title"
                    />
                    <Button
                      type="button"
                      onClick={() => setSkillCategories(skillCategories.filter((_, i) => i !== idx))}
                      variant="ghost"
                      size="xs"
                      icon
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Skills List (Comma separated)
                    </label>
                    <textarea
                      rows={4}
                      value={cat.skills.join(", ")}
                      onChange={(e) => {
                        const copy = [...skillCategories];
                        copy[idx].skills = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        setSkillCategories(copy);
                      }}
                      className="w-full mt-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-200 text-xs outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 06: Languages & Soft Skills                              */}
        {/* ============================================================ */}
        {activeTab === "languages" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Spoken Languages */}
            <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Language Proficiency
                </h3>
                <Button
                  type="button"
                  onClick={() =>
                    setLanguages([
                      ...languages,
                      { name: "", level: "", badge: "" },
                    ])
                  }
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                >
                  <FiPlus /> Add Language
                </Button>
              </div>

              <div className="space-y-4">
                {languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative group"
                  >
                    <div className="flex justify-between items-center">
                      <input
                        value={lang.name}
                        onChange={(e) => {
                          const copy = [...languages];
                          copy[idx].name = e.target.value;
                          setLanguages(copy);
                        }}
                        placeholder="Language Name"
                        className="bg-transparent text-white font-bold text-sm outline-none"
                      />
                      <Button
                        type="button"
                        onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                        variant="ghost"
                        size="xs"
                        icon
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <FiTrash2 />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={lang.level}
                        onChange={(e) => {
                          const copy = [...languages];
                          copy[idx].level = e.target.value;
                          setLanguages(copy);
                        }}
                        placeholder="e.g. Native Proficiency"
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-neutral-300 outline-none"
                      />
                      <input
                        value={lang.badge}
                        onChange={(e) => {
                          const copy = [...languages];
                          copy[idx].badge = e.target.value;
                          setLanguages(copy);
                        }}
                        placeholder="Badge (e.g. Native)"
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-neutral-300 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-6">
              <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/10 pb-4">
                Professional Competencies
              </h3>

              <div>
                <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                  Competencies List (One per line)
                </label>
                <textarea
                  rows={8}
                  value={softSkills.join("\n")}
                  onChange={(e) =>
                    setSoftSkills(e.target.value.split("\n").filter((s) => s.trim() !== ""))
                  }
                  className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-neutral-200 text-sm outline-none focus:border-white/40 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 07: Methodology & Values                                 */}
        {/* ============================================================ */}
        {activeTab === "methodology" && (
          <div className="p-8 bg-[#1A1A1A]/40 border border-white/5 rounded-3xl backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white tracking-wide">
                07. Methodology & Values
              </h3>
              <Button
                type="button"
                onClick={() =>
                  setMethodologies([
                    ...methodologies,
                    { title: "", text: "" },
                  ])
                }
                variant="secondary"
                size="sm"
                className="gap-1.5"
              >
                <FiPlus /> Add Value
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {methodologies.map((m, idx) => (
                <div key={idx} className="space-y-3 p-5 bg-white/5 rounded-2xl border border-white/5 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-[#919191] uppercase font-bold tracking-wider">
                      Item #{idx + 1}
                    </label>
                    <Button
                      type="button"
                      onClick={() => setMethodologies(methodologies.filter((_, i) => i !== idx))}
                      variant="ghost"
                      size="xs"
                      icon
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                  <div>
                    <input
                      value={m.title}
                      onChange={(e) => {
                        const copy = [...methodologies];
                        copy[idx].title = e.target.value;
                        setMethodologies(copy);
                      }}
                      placeholder="Title"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={4}
                      value={m.text}
                      onChange={(e) => {
                        const copy = [...methodologies];
                        copy[idx].text = e.target.value;
                        setMethodologies(copy);
                      }}
                      placeholder="Description"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-neutral-300 text-xs outline-none focus:border-white/40 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default ManageAbout;
