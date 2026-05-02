import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiUploadCloud } from "react-icons/fi";
import Button from "../../components/Button";
import RichTextEditor from "../../components/RichTextEditor";

interface Blog {
  id: string;
  title: string;
  short_description: string;
  category: string;
  date: string;
  image_url: string;
  cover_image: string;
  content: string;
  author: string;
  tags: string[];
}

const ManageBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setBlogs(data || []);
    setLoading(false);
  };

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || "",
        short_description: blog.short_description || "",
        category: blog.category || "",
        date: blog.date || "",
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
    if (editingBlog) {
      const { error } = await supabase
        .from("blogs")
        .update(formData)
        .eq("id", editingBlog.id);
      if (!error) {
        setIsModalOpen(false);
        fetchBlogs();
      }
    } else {
      const { error } = await supabase.from("blogs").insert([formData]);
      if (!error) {
        setIsModalOpen(false);
        fetchBlogs();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (!error) fetchBlogs();
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blogs/editor/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image_url" | "cover_image") => {
    try {
      setUploading(field);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      setFormData({ ...formData, [field]: data.publicUrl });
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
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
                <RichTextEditor
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
