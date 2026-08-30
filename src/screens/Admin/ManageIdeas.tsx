import React, { useEffect, useState } from "react";
import { ideaService, storageService } from "../../services";
import { FiPlus, FiX, FiCheck, FiTrash2, FiZap, FiMap, FiCheckSquare, FiLayers, FiCircle, FiEdit2, FiLoader, FiCheckCircle, FiArchive } from "react-icons/fi";
import Button from "../../components/Button";
import TipTapEditor from "../../components/TipTapEditor";
import CustomSelect from "../../components/CustomSelect";
import { useAlert } from "../../context/AlertContext";
import type { Idea } from "../../types";

const ManageIdeas: React.FC = () => {
  const { toast, confirm } = useAlert();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("in_progress");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "in_progress" as 'draft' | 'in_progress' | 'completed' | 'ignored',
    category: "idea" as 'idea' | 'plan' | 'task',
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const data = await ideaService.getAll();
      setIdeas(data);
    } catch (err: any) {
      toast.error("Failed to load ideas: " + err.message, "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (idea?: Idea) => {
    if (idea) {
      setEditingIdea(idea);
      setFormData({
        title: idea.title || "",
        content: idea.content || "",
        status: idea.status || "draft",
        category: idea.category || "idea",
      });
    } else {
      setEditingIdea(null);
      setFormData({
        title: "",
        content: "",
        status: "in_progress",
        category: "idea",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please provide a title for your idea.", "Missing Title");
      return;
    }
    try {
      if (editingIdea) {
        await ideaService.update(editingIdea.id, formData);
        setIsModalOpen(false);
        fetchIdeas();
        toast.success("Idea updated successfully!", "Saved");
      } else {
        await ideaService.create(formData);
        setIsModalOpen(false);
        fetchIdeas();
        toast.success("New idea added successfully!", "Saved");
      }
    } catch (err: any) {
      toast.error("Failed to save idea: " + err.message, "Error");
    }
  };

  const handleIgnore = async (e: React.MouseEvent, idea: Idea) => {
    e.stopPropagation();
    const isConfirmed = await confirm({
      title: "Ignore Note",
      message: `Are you sure you want to move "${idea.title}" to ignored?`,
      confirmText: "Ignore",
      cancelText: "Cancel",
      type: "warning"
    });
    if (isConfirmed) {
      // Optimistic update
      setIdeas(ideas.map(i => i.id === idea.id ? { ...i, status: 'ignored' } : i));
      try {
        await ideaService.update(idea.id, { status: 'ignored' });
        toast.success("Idea moved to ignored");
      } catch (err: any) {
        toast.error("Failed to ignore idea: " + err.message, "Error");
        fetchIdeas(); // revert on fail
      }
    }
  };

  const toggleComplete = async (e: React.MouseEvent, idea: Idea) => {
    e.stopPropagation();
    const newStatus = idea.status === 'completed' ? 'in_progress' : 'completed';
    
    // Optimistic UI update
    setIdeas(ideas.map(i => i.id === idea.id ? { ...i, status: newStatus } : i));
    
    try {
      await ideaService.update(idea.id, { status: newStatus });
    } catch (err: any) {
      toast.error("Failed to update status");
      fetchIdeas(); // revert on failure
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const url = await storageService.uploadImage(file, "ideas");
      return url;
    } catch (error: any) {
      toast.error("Image upload failed: " + error.message, "Error");
      throw error;
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchCategory = filterCategory === "all" || idea.category === filterCategory;
    const matchStatus = filterStatus === "all" || idea.status === filterStatus;
    return matchCategory && matchStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-[#C5C5C5] tracking-tighter">My Workspace</h2>
          <p className="text-[#919191] text-sm mt-2 max-w-xl leading-relaxed">
            Personal ideas, plans, and tasks. Only visible to you.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" className="gap-2">
          <FiPlus className="text-xl" />
          <span>New Entry</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 relative z-[60]">
        <CustomSelect
          value={filterCategory}
          onChange={(val) => setFilterCategory(val)}
          options={[
            { value: "all", label: "All Types", icon: <FiLayers /> },
            { value: "idea", label: "Ideas", icon: <FiZap /> },
            { value: "plan", label: "Plans", icon: <FiMap /> },
            { value: "task", label: "Tasks", icon: <FiCheckSquare /> },
          ]}
        />

        <CustomSelect
          value={filterStatus}
          onChange={(val) => setFilterStatus(val)}
          options={[
            { value: "all", label: "All Statuses", icon: <FiCircle /> },
            { value: "draft", label: "Draft", icon: <FiEdit2 /> },
            { value: "in_progress", label: "In Progress", icon: <FiLoader /> },
            { value: "completed", label: "Completed", icon: <FiCheckCircle /> },
            { value: "ignored", label: "Ignored", icon: <FiArchive /> },
          ]}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-[#919191]">Loading workspace...</div>
      ) : filteredIdeas.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-3xl bg-[#141414]/50">
          <p className="text-[#919191] mb-4">No ideas found matching your filters.</p>
          <Button onClick={() => handleOpenModal()} variant="secondary">Create a new entry</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <div 
              key={idea.id} 
              className={`group relative bg-[#141414] border hover:border-white/20 p-6 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col min-h-[200px] h-auto ${idea.status === 'completed' ? 'border-green-400/10 opacity-75 hover:opacity-100' : 'border-white/5'}`}
              onClick={() => { setIsViewMode(true); handleOpenModal(idea); }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center text-[#555555]">
                  <span className="text-xs uppercase tracking-widest font-bold text-[#919191]">
                    {idea.category}
                  </span>
                  <span>•</span>
                  <span className="text-xs uppercase tracking-widest font-bold text-[#919191]">
                    {idea.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => toggleComplete(e, idea)}
                    className={`p-2 rounded-full transition-colors ${idea.status === 'completed' ? 'text-green-400 bg-green-400/10' : 'text-[#919191] hover:text-green-400 hover:bg-green-400/10'}`}
                    title={idea.status === 'completed' ? "Mark as In Progress" : "Mark as Completed"}
                  >
                    <FiCheck />
                  </button>

                  <button 
                    onClick={(e) => handleIgnore(e, idea)}
                    className="p-2 text-[#919191] hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                    title="Ignore Note"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-2 line-clamp-2 transition-all ${idea.status === 'completed' ? 'text-[#555555] line-through' : 'text-[#C5C5C5]'}`}>
                {idea.title}
              </h3>
              
              <div 
                className={`text-xs line-clamp-4 prose-sm prose-invert transition-all ${idea.status === 'completed' ? 'text-[#333333]' : 'text-[#919191]'}`}
                dangerouslySetInnerHTML={{ __html: idea.content || "<span class='italic opacity-50'>No content...</span>" }}
              />

              <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-[#555555] font-medium tracking-widest uppercase">
                {idea.created_at ? new Date(idea.created_at).toLocaleDateString() : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-5xl bg-[#141414] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-[#141414]/80 backdrop-blur-xl z-20 shrink-0">
              <div className="flex gap-4 items-center">
                <h3 className="text-2xl font-bold text-[#C5C5C5]">
                  {isViewMode ? "View Note" : (editingIdea ? "Edit Note" : "New Note")}
                </h3>
                
                {/* Meta Controls inline in header for Notion-like feel */}
                {!isViewMode ? (
                  <>
                    <CustomSelect
                      value={formData.category}
                      onChange={(val) => setFormData({...formData, category: val as any})}
                      options={[
                        { value: "idea", label: "Idea", icon: <FiZap /> },
                        { value: "plan", label: "Plan", icon: <FiMap /> },
                        { value: "task", label: "Task", icon: <FiCheckSquare /> },
                      ]}
                    />

                    <CustomSelect
                      value={formData.status}
                      onChange={(val) => setFormData({...formData, status: val as any})}
                      options={[
                        { value: "draft", label: "Draft", icon: <FiEdit2 /> },
                        { value: "in_progress", label: "In Progress", icon: <FiLoader /> },
                        { value: "completed", label: "Completed", icon: <FiCheckCircle /> },
                        { value: "ignored", label: "Ignored", icon: <FiArchive /> },
                      ]}
                    />
                  </>
                ) : (
                  <div className="flex gap-2 items-center text-[#555555]">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#919191]">
                      {formData.category}
                    </span>
                    <span>•</span>
                    <span className="text-xs uppercase tracking-widest font-bold text-[#919191]">
                      {formData.status.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} icon className="hover:bg-white/5 text-[#919191] hover:text-[#C5C5C5]">
                  <FiX className="text-2xl" />
                </Button>
                {isViewMode ? (
                  <Button onClick={() => setIsViewMode(false)} variant="secondary" className="gap-2">
                    <FiEdit2 className="text-xl" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} variant="primary" className="gap-2">
                    <FiCheck className="text-xl" />
                    <span>Save</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="p-10 overflow-y-auto no-scrollbar flex-1">
              <input
                type="text"
                placeholder="Note Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                readOnly={isViewMode}
                className="w-full bg-transparent border-none text-5xl font-bold text-[#C5C5C5] placeholder-[#555555] focus:outline-none mb-8"
                autoFocus={!isViewMode}
              />
              
              <div className={`border rounded-3xl overflow-hidden ${isViewMode ? 'border-transparent' : 'border-white/5'}`}>
                <TipTapEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Start typing your ideas here..."
                  onImageUpload={handleImageUpload}
                  readOnly={isViewMode}
                  minimal={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageIdeas;
