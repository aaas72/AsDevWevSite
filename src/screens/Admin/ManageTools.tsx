import React, { useEffect, useState } from "react";
import { toolService, storageService } from "../../services";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiUploadCloud } from "react-icons/fi";
import Button from "../../components/Button";
import { useAlert } from "../../context/AlertContext";
import type { Tool } from "../../types";

const ManageTools: React.FC = () => {
  const { toast, confirm } = useAlert();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon_url: "",
    category: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const data = await toolService.getAll();
      setTools(data);
    } catch (err: any) {
      toast.error("Failed to fetch tools: " + err.message, "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tool?: Tool) => {
    if (tool) {
      setEditingTool(tool);
      setFormData({
        name: tool.name,
        icon_url: tool.icon_url,
        category: tool.category,
      });
    } else {
      setEditingTool(null);
      setFormData({ name: "", icon_url: "", category: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTool) {
        await toolService.update(editingTool.id, formData);
        setIsModalOpen(false);
        fetchTools();
        toast.success("Tool / Stack updated successfully!", "Saved");
      } else {
        await toolService.create(formData);
        setIsModalOpen(false);
        fetchTools();
        toast.success("New tool / stack registered successfully!", "Created");
      }
    } catch (error: any) {
      toast.error("Failed to save tool: " + error.message, "Error");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Tool",
      message: "Are you sure you want to delete this tool/stack from your arsenal?",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (isConfirmed) {
      try {
        await toolService.delete(id);
        fetchTools();
        toast.success("Tool removed successfully.", "Deleted");
      } catch (error: any) {
        toast.error("Failed to remove tool: " + error.message, "Error");
      }
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const publicUrl = await storageService.uploadImage(file, "tools");

      setFormData({ ...formData, icon_url: publicUrl });
      toast.success("Icon uploaded successfully!", "Upload Complete");
    } catch (error: any) {
      toast.error("Error uploading icon: " + error.message, "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#C5C5C5]">Stacks & Tools</h2>
          <p className="text-[#919191] text-sm mt-2 tracking-wide font-medium">Manage your technical arsenal.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-3 px-8 py-4 bg-[#C5C5C5] text-black rounded-2xl font-bold hover:bg-white transition-all duration-300 text-xs tracking-widest shadow-lg shadow-[#C5C5C5]/5"
        >
          <FiPlus className="text-lg" /> ADD STACK
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-[#919191] animate-pulse tracking-widest text-xs">LOADING STACKS...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tools.map((tool) => (
            <div key={tool.id} className="p-8 bg-[#171717]/60 border border-white/5 rounded-3xl flex flex-col items-center gap-4 group relative backdrop-blur-xl hover:border-white/20 transition-all duration-500">
              <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center overflow-hidden p-3 grayscale group-hover:grayscale-0 transition-all duration-500">
                {tool.icon_url ? (
                  <img src={tool.icon_url} alt={tool.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-white/5 rounded-full" />
                )}
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-white truncate w-full group-hover:text-[#C5C5C5] transition-colors">{tool.name}</div>
                <div className="text-[9px] text-[#919191] uppercase tracking-[0.2em] mt-1 font-bold">{tool.category}</div>
              </div>
              
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 rounded-3xl backdrop-blur-sm">
                <button onClick={() => handleOpenModal(tool)} className="p-3 bg-white/10 hover:bg-[#C5C5C5] rounded-xl text-[#C5C5C5] hover:text-black transition-all duration-300"><FiEdit2 /></button>
                <button onClick={() => handleDelete(tool.id)} className="p-3 bg-white/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all duration-300"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden no-scrollbar">
            <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#141414]/80 backdrop-blur-xl z-10">
              <div>
                <h3 className="text-2xl font-bold text-[#C5C5C5]">{editingTool ? "Refine Stack" : "New Stack"}</h3>
                <p className="text-[#919191] text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Inventory Interface</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Tool Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="e.g. React.js"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-6 py-4 bg-[#1A1A1A] border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5] appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Icon Representation</label>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden p-3 backdrop-blur-xl">
                      {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-contain" /> : <div className="w-8 h-8 bg-white/5 rounded-full" />}
                    </div>
                    <label className="flex-1 cursor-pointer px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-[#C5C5C5] text-xs font-bold">
                      <FiUploadCloud /> {uploading ? "..." : "UPLOAD ICON"}
                      <input type="file" className="hidden" accept="image/*" onChange={handleIconUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-10">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full py-6 font-bold tracking-[0.3em] text-xs"
                >
                  {editingTool ? "SYNCHRONIZE STACK" : "ADD TO ARSENAL"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTools;
