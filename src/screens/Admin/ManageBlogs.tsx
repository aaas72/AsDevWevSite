import React, { useEffect, useState } from "react";
import { blogService, storageService } from "../../services";
import { FiPlus, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button";
import ImageUpload from "../../components/ImageUpload";
import TipTapEditor from "../../components/TipTapEditor";
import { useAlert } from "../../context/AlertContext";
import BlogCard from "../../components/Cards/BlogCard";
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
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="md"
          className="gap-3"
        >
          <FiPlus className="text-lg" /> CREATE POST
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-[#919191] animate-pulse tracking-widest text-xs font-medium">SYNCING ARTICLES...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              shortDescription={blog.short_description}
              category={blog.category}
              date={new Date(blog.created_at || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
              imageUrl={blog.image_url}
              isAdmin={true}
              onEdit={() => handleOpenModal(blog)}
              onDelete={() => handleDelete(blog.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-[#141414] border border-white/10 rounded-3xl shadow-3xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#141414]/80 backdrop-blur-xl z-20">
              <div>
                <h3 className="text-2xl font-bold text-[#C5C5C5]">{editingBlog ? "Refine Article" : "Draft New Post"}</h3>
                <p className="text-[#919191] text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Editorial Interface</p>
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
                <ImageUpload
                  label="Preview Image"
                  value={formData.image_url}
                  onChange={(e) => handleImageUpload(e, "image_url")}
                  isUploading={uploading === "image_url"}
                  dimensions="800x1000 (4:5)"
                  uploadText="THUMBNAIL"
                />
                <ImageUpload
                  label="Hero Image"
                  value={formData.cover_image}
                  onChange={(e) => handleImageUpload(e, "cover_image")}
                  isUploading={uploading === "cover_image"}
                  dimensions="1920x600 (3:1)"
                  uploadText="HERO"
                />
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
