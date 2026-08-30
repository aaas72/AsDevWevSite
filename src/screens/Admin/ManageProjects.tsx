import React, { useEffect, useState } from "react";
import { projectService, storageService } from "../../services";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button";
import ImageUpload from "../../components/ImageUpload";
import TipTapEditor from "../../components/TipTapEditor";
import { useAlert } from "../../context/AlertContext";
import BlogCard from "../../components/Cards/BlogCard";
import type { Project, ProjectResult } from "../../types";

const ManageProjects: React.FC = () => {
  const { toast, confirm } = useAlert();
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
    results: [] as ProjectResult[],
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
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err: any) {
      toast.error("Failed to load projects: " + err.message, "Error");
    } finally {
      setLoading(false);
    }
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
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
        setIsModalOpen(false);
        fetchProjects();
        toast.success("Project updated successfully!", "Saved");
      } else {
        await projectService.create(formData);
        setIsModalOpen(false);
        fetchProjects();
        toast.success("New project forged successfully!", "Created");
      }
    } catch (error: any) {
      toast.error("Failed to save project: " + error.message, "Error");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Project",
      message: "Are you sure you want to delete this project? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (isConfirmed) {
      try {
        await projectService.delete(id);
        fetchProjects();
        toast.success("Project deleted successfully.", "Deleted");
      } catch (error: any) {
        toast.error("Failed to delete project: " + error.message, "Error");
      }
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    return storageService.uploadImage(file, "projects/editor");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, resultIndex?: number) => {
    try {
      setUploading(field);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const publicUrl = await storageService.uploadImage(file, "projects");
      
      if (resultIndex !== undefined) {
        const newResults = [...formData.results];
        newResults[resultIndex].imageUrl = publicUrl;
        setFormData({ ...formData, results: newResults });
      } else {
        setFormData({ ...formData, [field]: publicUrl });
      }
      toast.success("Image uploaded successfully!", "Upload Complete");
    } catch (error: any) {
      toast.error("Error uploading image: " + error.message, "Upload Error");
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

  const updateResult = (index: number, field: keyof ProjectResult, value: string) => {
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
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="md"
          className="gap-3"
        >
          <FiPlus className="text-lg" /> ADD PROJECT
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-[#919191] animate-pulse tracking-widest text-xs">SYNCHRONIZING DATABASE...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project) => (
            <BlogCard
              key={project.id}
              id={project.id}
              title={project.title}
              shortDescription={project.short_description || project.category || "Uncategorized"}
              category={project.category || "Uncategorized"}
              date={new Date(project.created_at || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
              imageUrl={project.image_url}
              isAdmin={true}
              onEdit={() => handleOpenModal(project)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#141414] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#141414]/80 backdrop-blur-xl z-20">
              <div>
                <h3 className="text-2xl font-bold text-[#C5C5C5]">{editingProject ? "Refine Project" : "Forge New Project"}</h3>
                <p className="text-[#919191] text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Drafting Interface</p>
              </div>
              <Button variant="ghost" size="sm" icon onClick={() => setIsModalOpen(false)}><FiX size={24} /></Button>
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
                <ImageUpload
                  label="Thumbnail Image"
                  value={formData.image_url}
                  onChange={(e) => handleImageUpload(e, "image_url")}
                  isUploading={uploading === "image_url"}
                  dimensions="1280x720 (16:9)"
                  uploadText="THUMBNAIL"
                />
                <ImageUpload
                  label="Cover Image (Header)"
                  value={formData.cover_image}
                  onChange={(e) => handleImageUpload(e, "cover_image")}
                  isUploading={uploading === "cover_image"}
                  dimensions="1920x1080 (16:9)"
                  uploadText="COVER"
                />
              </div>

              {/* Dynamic Results Section */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-[#C5C5C5] tracking-tight">Project Results & Pages</h4>
                    <p className="text-[10px] text-[#919191] uppercase tracking-[0.2em] mt-1">Unlimited Detail Sections</p>
                  </div>
                  <Button
                    type="button"
                    onClick={addResult}
                    variant="secondary"
                    size="sm"
                    icon
                  >
                    <FiPlus size={20} />
                  </Button>
                </div>

                <div className="space-y-8">
                  {formData.results.map((result, index) => (
                    <div key={index} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] space-y-6 relative group">
                      <Button
                        type="button"
                        onClick={() => removeResult(index)}
                        variant="danger"
                        size="sm"
                        icon
                        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 />
                      </Button>
                      
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
                        
                        <ImageUpload
                          label="Result Image"
                          value={result.imageUrl || ""}
                          onChange={(e) => handleImageUpload(e, `result_${index}`, index)}
                          isUploading={uploading === `result_${index}`}
                          dimensions="1280x720 (16:9)"
                          uploadText="IMAGE"
                        />
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
