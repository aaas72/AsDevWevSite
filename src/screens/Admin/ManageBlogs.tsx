import React, { useEffect, useState } from "react";
import { blogService, storageService } from "../../services";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiUploadCloud } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button";
import TipTapEditor from "../../components/TipTapEditor";
import { useAlert } from "../../context/AlertContext";
import type { Blog } from "../../types";

const ManageBlogs: React.FC = () => {
  const { toast, confirm } = useAlert();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    category: "",
    date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', ' /'),
    image_url: "",
    cover_image: "",
    content: "",
    author: "Abdellah S.DEV",
    tags: [] as string[],
  });
  const [uploading, setUploading] = useState<"image_url" | "cover_image" | null>(null);

  useEffect(() => {
    fetchBlogs();

    // Check for "action=new" in URL
    const params = new URLSearchParams(location.search);
    if (params.get("action") === "new") {
      handleOpenModal();
      // Clean up the URL to prevent re-opening on refresh
      window.history.replaceState({}, "", window.location.pathname + window.location.hash.split('?')[0]);
    }
  }, [location]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAll();
      setBlogs(data);
    } catch (err: any) {
      toast.error("Failed to load blogs: " + err.message, "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || "",
        short_description: blog.short_description || "",
        category: blog.category || "",
        date: blog.date || new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', ' /'),
        image_url: blog.image_url || "",
        cover_image: blog.cover_image || "",
        content: blog.content || "",
        author: blog.author || "Abdellah S.DEV",
        tags: blog.tags || [],
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        short_description: "",
        category: "",
        date: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', ' /'),
        image_url: "",
        cover_image: "",
        content: "",
        author: "Abdellah S.DEV",
        tags: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await blogService.update(editingBlog.id, formData);
        setIsModalOpen(false);
        fetchBlogs();
        toast.success("Blog article updated successfully!", "Saved");
      } else {
        await blogService.create(formData);
        setIsModalOpen(false);
        fetchBlogs();
        toast.success("New article published successfully!", "Published");
      }
    } catch (error: any) {
      toast.error("Failed to save blog: " + error.message, "Error");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Article",
      message: "Are you sure you want to delete this blog post? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (isConfirmed) {
      try {
        await blogService.delete(id);
        fetchBlogs();
        toast.success("Article deleted successfully.", "Deleted");
      } catch (error: any) {
        toast.error("Failed to delete article: " + error.message, "Error");
      }
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    return storageService.uploadImage(file, "blogs/editor");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image_url" | "cover_image") => {
    try {
      setUploading(field);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const publicUrl = await storageService.uploadImage(file, "blogs");

      setFormData({ ...formData, [field]: publicUrl });
      toast.success("Image uploaded successfully!", "Upload Complete");
    } catch (error: any) {
      toast.error("Error uploading image: " + error.message, "Upload Failed");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#C5C5C5]">Blogs</h2>
          <p className="text-[#919191] text-sm mt-2 tracking-wide font-medium">Broadcast your technical insights.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-3 px-8 py-4 bg-[#C5C5C5] text-black rounded-2xl font-bold hover:bg-white transition-all duration-300 text-xs tracking-widest shadow-lg shadow-[#C5C5C5]/5"
        >
          <FiPlus className="text-lg" /> CREATE POST
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-[#919191] animate-pulse tracking-widest text-xs font-medium">SYNCING ARTICLES...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="group bg-[#171717]/60 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-white/20 transition-all duration-500">
              <div className="aspect-[16/9] bg-black/40 overflow-hidden relative">
                {blog.image_url ? (
                  <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-800 text-[10px] tracking-widest font-bold">NO THUMBNAIL</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent opacity-60"></div>
              </div>
              <div className="p-8">
                <div className="text-[10px] text-[#919191] uppercase tracking-[0.3em] mb-2 font-bold">{blog.category}</div>
                <h3 className="text-xl font-bold text-white truncate group-hover:text-[#C5C5C5] transition-colors">{blog.title}</h3>
                <div className="mt-8 flex items-center gap-3">
                  <button onClick={() => handleOpenModal(blog)} className="p-3 bg-white/5 hover:bg-[#C5C5C5] rounded-xl text-[#C5C5C5] hover:text-black transition-all duration-300"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(blog.id)} className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-red-400 transition-all duration-300"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#141414] border border-white/10 rounded-3xl shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#141414]/80 backdrop-blur-xl z-10">
              <div>
                <h3 className="text-2xl font-bold text-[#C5C5C5]">{editingBlog ? "Refine Article" : "Draft New Post"}</h3>
                <p className="text-[#919191] text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Editorial Interface</p>
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
                    placeholder="Article Headline"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Category</label>
                  <input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                    placeholder="Technical / Design / Life"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Short Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5]"
                  placeholder="A brief summary for the preview card"
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Preview Image</label>
                  <div className="relative group/upload h-40 bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20">
                    {formData.image_url ? (
                      <div className="relative w-full h-full group">
                        <img src={formData.image_url} alt="Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className="cursor-pointer px-4 py-2 bg-white text-black rounded-lg text-[10px] font-bold tracking-widest">
                            CHANGE THUMBNAIL
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "image_url")} disabled={!!uploading} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-white/5 transition-colors">
                        <FiUploadCloud className="text-2xl text-[#919191] mb-2" />
                        <span className="text-[10px] font-bold tracking-widest text-[#919191]">{uploading === "image_url" ? "UPLOADING..." : "UPLOAD THUMBNAIL"}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "image_url")} disabled={!!uploading} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Hero Image</label>
                  <div className="relative group/upload h-40 bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20">
                    {formData.cover_image ? (
                      <div className="relative w-full h-full group">
                        <img src={formData.cover_image} alt="Hero" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <label className="cursor-pointer px-4 py-2 bg-white text-black rounded-lg text-[10px] font-bold tracking-widest">
                            CHANGE HERO
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover_image")} disabled={!!uploading} />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-white/5 transition-colors">
                        <FiUploadCloud className="text-2xl text-[#919191] mb-2" />
                        <span className="text-[10px] font-bold tracking-widest text-[#919191]">{uploading === "cover_image" ? "UPLOADING..." : "UPLOAD HERO"}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover_image")} disabled={!!uploading} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Content (Rich Text Editor)</label>
                <TipTapEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your article here..."
                  onImageUpload={handleEditorImageUpload}
                />
              </div>

              <div className="pt-10">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full py-6 font-bold tracking-[0.3em] text-xs"
                >
                  {editingBlog ? "UPDATE ARTICLE" : "PUBLISH ARTICLE"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
