import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiUploadCloud, FiExternalLink, FiImage } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button";
import TipTapEditor from "../../components/TipTapEditor";

interface Result {
  title: string;
  description: string;
  imageUrl: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  overview: string;
  challenge: string;
  services: string[];
  technical_stack: string[];
  image_url: string;
  cover_image: string;
  project_url: string;
  website: string;
  category: string;
  results: Result[];
}

const ManageProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    overview: "",
    challenge: "",
    services: [] as string[],
    technical_stack: [] as string[],
    image_url: "",
    cover_image: "",
    project_url: "",
    website: "",
    category: "",
    results: [] as Result[],
  });
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    
    // Check for "action=new" in URL
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "new") {
      handleOpenModal();
      // Clean up the URL to prevent re-opening on refresh
      window.history.replaceState({}, "", window.location.pathname + window.location.hash.split('?')[0]);
    }
  }, [location]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setProjects(data || []);
    setLoading(false);
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || "",
        description: project.description || "",
        short_description: project.short_description || "",
        overview: project.overview || "",
        challenge: project.challenge || "",
        services: project.services || [],
        technical_stack: project.technical_stack || [],
        image_url: project.image_url || "",
        cover_image: project.cover_image || "",
        project_url: project.project_url || "",
        website: project.website || "",
        category: project.category || "",
        results: project.results || [],
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        short_description: "",
        overview: "",
        challenge: "",
        services: [],
        technical_stack: [],
        image_url: "",
        cover_image: "",
        project_url: "",
        website: "",
        category: "",
        results: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(formData)
        .eq("id", editingProject.id);
      if (!error) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from("projects").insert([formData]);
      if (!error) {
        setIsModalOpen(false);
        fetchProjects();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) fetchProjects();
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `projects/editor/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, resultIndex?: number) => {
    try {
      setUploading(field);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      
      if (resultIndex !== undefined) {
        const newResults = [...formData.results];
        newResults[resultIndex].imageUrl = data.publicUrl;
        setFormData({ ...formData, results: newResults });
      } else {
        setFormData({ ...formData, [field]: data.publicUrl });
      }
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(null);
    }
  };

  const addResult = () => {
    setFormData({
      ...formData,
      results: [...formData.results, { title: "", description: "", imageUrl: "" }]
    });
  };

  const removeResult = (index: number) => {
    const newResults = [...formData.results];
    newResults.splice(index, 1);
    setFormData({ ...formData, results: newResults });
  };

  const updateResult = (index: number, field: keyof Result, value: string) => {
    const newResults = [...formData.results];
    newResults[index] = { ...newResults[index], [field]: value };
    setFormData({ ...formData, results: newResults });
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#C5C5C5]">Projects</h2>
          <p className="text-[#919191] text-sm mt-2 tracking-wide font-medium">Curate your portfolio masterpieces.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-3 px-8 py-4 bg-[#C5C5C5] text-black rounded-2xl font-bold hover:bg-white transition-all duration-300 text-xs tracking-widest shadow-lg shadow-[#C5C5C5]/5"
        >
          <FiPlus className="text-lg" /> ADD PROJECT
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-[#919191] animate-pulse tracking-widest text-xs">SYNCHRONIZING DATABASE...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-[#171717]/60 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl hover:border-white/20 transition-all duration-500">
              <div className="aspect-video bg-black/40 overflow-hidden relative">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-800 text-xs tracking-widest">NO PREVIEW</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent opacity-60"></div>
              </div>
              <div className="p-8">
                <div className="text-[10px] text-[#919191] uppercase tracking-[0.3em] mb-2 font-bold">{project.category || "Uncategorized"}</div>
                <h3 className="text-xl font-bold text-white truncate group-hover:text-[#C5C5C5] transition-colors">{project.title}</h3>
                <div className="mt-8 flex items-center gap-3">
                  <button onClick={() => handleOpenModal(project)} className="p-3 bg-white/5 hover:bg-[#C5C5C5] rounded-xl text-[#C5C5C5] hover:text-black transition-all duration-300"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-red-400 transition-all duration-300"><FiTrash2 /></button>
                  <div className="flex-1"></div>
                  {project.website && <a href={project.website} target="_blank" rel="noreferrer" className="text-[#919191] hover:text-white transition-colors"><FiExternalLink /></a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#141414] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#141414]/80 backdrop-blur-xl z-10">
              <div>
                <h3 className="text-2xl font-bold text-[#C5C5C5]">{editingProject ? "Refine Project" : "Forge New Project"}</h3>
                <p className="text-[#919191] text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Drafting Interface</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="Project Name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Category</label>
                  <input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="Web App / Brand Design"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Short Description</label>
                <input
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                  placeholder="Elevator pitch for the project"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Detailed Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                  placeholder="Primary content for the project card"
                />
              </div>

              <div className="grid grid-cols-1 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Project Overview (Rich Text)</label>
                  <TipTapEditor
                    value={formData.overview}
                    onChange={(content) => setFormData({ ...formData, overview: content })}
                    placeholder="Deep dive into the project goals..."
                    onImageUpload={handleEditorImageUpload}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">The Challenge (Rich Text)</label>
                  <TipTapEditor
                    value={formData.challenge}
                    onChange={(content) => setFormData({ ...formData, challenge: content })}
                    placeholder="What problems were solved?"
                    onImageUpload={handleEditorImageUpload}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Services (comma separated)</label>
                  <input
                    value={formData.services.join(", ")}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value.split(",").map(s => s.trim()) })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="UI Design, Backend, API"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Tech Stack (comma separated)</label>
                  <input
                    value={formData.technical_stack.join(", ")}
                    onChange={(e) => setFormData({ ...formData, technical_stack: e.target.value.split(",").map(s => s.trim()) })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="React, Supabase, TypeScript"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Source URL</label>
                  <input
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="GitHub Repo URL"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Live Website</label>
                  <input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Thumbnail Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-[#C5C5C5] text-xs"
                        placeholder="Image URL"
                      />
                    </div>
                    <label className="cursor-pointer px-6 py-4 bg-white text-black rounded-2xl hover:bg-[#C5C5C5] transition-all font-bold text-[10px] tracking-widest flex items-center gap-2">
                      <FiUploadCloud /> {uploading === "image_url" ? "..." : "UPLOAD"}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "image_url")} disabled={!!uploading} />
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Cover Image (Header)</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        value={formData.cover_image}
                        onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-[#C5C5C5] text-xs"
                        placeholder="Cover URL"
                      />
                    </div>
                    <label className="cursor-pointer px-6 py-4 bg-white text-black rounded-2xl hover:bg-[#C5C5C5] transition-all font-bold text-[10px] tracking-widest flex items-center gap-2">
                      <FiUploadCloud /> {uploading === "cover_image" ? "..." : "UPLOAD"}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover_image")} disabled={!!uploading} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Dynamic Results Section */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-[#C5C5C5] tracking-tight">Project Results & Pages</h4>
                    <p className="text-[10px] text-[#919191] uppercase tracking-[0.2em] mt-1">Unlimited Detail Sections</p>
                  </div>
                  <button
                    type="button"
                    onClick={addResult}
                    className="p-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl transition-all"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  {formData.results.map((result, index) => (
                    <div key={index} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] space-y-6 relative group">
                      <button
                        type="button"
                        onClick={() => removeResult(index)}
                        className="absolute top-6 right-6 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[8px] text-[#919191] uppercase tracking-[0.2em] font-bold">Section Title</label>
                            <input
                              value={result.title}
                              onChange={(e) => updateResult(index, "title", e.target.value)}
                              className="w-full bg-transparent border-b border-white/10 py-2 outline-none text-[#C5C5C5] focus:border-white transition-all"
                              placeholder="e.g. User Interface"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] text-[#919191] uppercase tracking-[0.2em] font-bold">Description</label>
                            <textarea
                              rows={3}
                              value={result.description}
                              onChange={(e) => updateResult(index, "description", e.target.value)}
                              className="w-full bg-transparent border-b border-white/10 py-2 outline-none text-[#919191] text-sm focus:border-white transition-all"
                              placeholder="Detail about this result..."
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-[8px] text-[#919191] uppercase tracking-[0.2em] font-bold">Result Image</label>
                          <div className="aspect-video bg-black/40 rounded-xl overflow-hidden relative group/img">
                            {result.imageUrl ? (
                              <img src={result.imageUrl} className="w-full h-full object-cover" alt="Result" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-700"><FiImage size={32} /></div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                              <FiUploadCloud className="text-2xl text-white" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, `result_${index}`, index)} 
                                disabled={!!uploading} 
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full py-6 font-bold tracking-[0.3em] text-xs"
                >
                  {editingProject ? "SYNCHRONIZE UPDATE" : "PUBLISH TO PORTFOLIO"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
