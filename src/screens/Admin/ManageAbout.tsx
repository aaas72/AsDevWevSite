import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FiSave, FiUploadCloud, FiUser, FiGithub, FiLinkedin, FiMail, FiPhone } from "react-icons/fi";
import Button from "../../components/Button";

const ManageAbout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    profile_image: "",
    headline: "",
    sub_headline: "",
    who_i_am_1: "",
    who_i_am_2: "",
    approach_1_title: "",
    approach_1_text: "",
    approach_2_title: "",
    approach_2_text: "",
    approach_3_title: "",
    approach_3_text: "",
    expertise_text: "",
    cta_text_1: "",
    cta_text_2: "",
    github_url: "",
    linkedin_url: "",
    email: "",
    phone: "",
    skills: "",
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .eq("id", 1)
      .single();
    
    if (!error && data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("about_content")
      .upsert({ id: 1, ...formData, updated_at: new Date() });
    
    if (error) alert(error.message);
    else alert("About content updated successfully!");
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `profile.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);
      setFormData({ ...formData, profile_image: data.publicUrl });
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center py-24 text-[#919191] animate-pulse tracking-widest text-xs uppercase">Connecting to Persona...</div>;

  return (
    <div className="space-y-12 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#C5C5C5]">Identity & Persona</h2>
          <p className="text-[#919191] text-sm mt-2 tracking-wide font-medium">Manage how the world perceives you.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="px-10 py-4 bg-[#C5C5C5] text-black font-bold tracking-widest text-xs"
        >
          <FiSave className="mr-2 text-lg" /> {saving ? "SAVING..." : "SAVE CHANGES"}
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar: Profile Photo & Social Links */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 bg-[#171717]/60 border border-white/5 rounded-[2.5rem] backdrop-blur-xl text-center space-y-6">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white/5 shadow-2xl relative group">
              {formData.profile_image ? (
                <img src={formData.profile_image} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl text-gray-700"><FiUser /></div>
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <FiUploadCloud className="text-3xl text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Profile Photo</h3>
              <p className="text-[10px] text-[#919191] uppercase tracking-[0.2em] mt-2">Professional Avatar</p>
            </div>
          </div>

          {/* New Social Links Section */}
          <div className="p-8 bg-[#171717]/60 border border-white/5 rounded-[2.5rem] backdrop-blur-xl space-y-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Connect Links</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] text-[#919191] uppercase font-bold tracking-widest"><FiGithub /> GitHub URL</label>
                <input 
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#C5C5C5] focus:border-[#C5C5C5] transition-all outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] text-[#919191] uppercase font-bold tracking-widest"><FiLinkedin /> LinkedIn URL</label>
                <input 
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#C5C5C5] focus:border-[#C5C5C5] transition-all outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] text-[#919191] uppercase font-bold tracking-widest"><FiMail /> Public Email</label>
                <input 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#C5C5C5] focus:border-[#C5C5C5] transition-all outline-none"
                  placeholder="hello@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[9px] text-[#919191] uppercase font-bold tracking-widest"><FiPhone /> Public Phone</label>
                <input 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-[#C5C5C5] focus:border-[#C5C5C5] transition-all outline-none"
                  placeholder="+123..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Bio & Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Section: Headline */}
          <div className="p-10 bg-[#171717]/40 border border-white/5 rounded-[3rem] backdrop-blur-md space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Main Headline</label>
              <textarea
                rows={2}
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5] text-2xl font-bold tracking-tight"
                placeholder="The core value proposition"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Sub Headline</label>
              <textarea
                rows={3}
                value={formData.sub_headline}
                onChange={(e) => setFormData({ ...formData, sub_headline: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#919191] leading-relaxed"
                placeholder="A bit more detail about your mission"
              />
            </div>
          </div>

          {/* Section: Bio */}
          <div className="p-10 bg-[#171717]/40 border border-white/5 rounded-[3rem] backdrop-blur-md space-y-8">
            <h3 className="text-lg font-bold text-[#C5C5C5] tracking-tight">Who I Am</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Paragraph 1</label>
                <textarea
                  rows={4}
                  value={formData.who_i_am_1}
                  onChange={(e) => setFormData({ ...formData, who_i_am_1: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5] leading-relaxed"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Paragraph 2</label>
                <textarea
                  rows={4}
                  value={formData.who_i_am_2}
                  onChange={(e) => setFormData({ ...formData, who_i_am_2: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5] leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section: Approach */}
          <div className="p-10 bg-[#171717]/40 border border-white/5 rounded-[3rem] backdrop-blur-md space-y-8">
            <h3 className="text-lg font-bold text-[#C5C5C5] tracking-tight">Technical Approach</h3>
            <div className="space-y-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-[#C5C5C5]/10 flex items-center justify-center text-[#C5C5C5] text-xs font-bold font-mono">0{i}</span>
                    <input
                      value={(formData as any)[`approach_${i}_title`]}
                      onChange={(e) => setFormData({ ...formData, [`approach_${i}_title`]: e.target.value })}
                      className="flex-1 bg-transparent border-b border-white/10 py-2 outline-none text-white font-bold tracking-tight focus:border-[#C5C5C5] transition-all"
                      placeholder={`Approach ${i} Title`}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={(formData as any)[`approach_${i}_text`]}
                    onChange={(e) => setFormData({ ...formData, [`approach_${i}_text`]: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#919191] text-sm leading-relaxed"
                    placeholder={`Description for approach ${i}...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Expertise & CTA */}
          <div className="space-y-12">
            <div className="p-10 bg-[#171717]/40 border border-white/5 rounded-[3rem] backdrop-blur-md space-y-6">
              <h3 className="text-lg font-bold text-[#C5C5C5] tracking-tight">Expertise & Skills</h3>
              <div className="space-y-4">
                <textarea
                  rows={4}
                  value={formData.expertise_text}
                  onChange={(e) => setFormData({ ...formData, expertise_text: e.target.value })}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#919191] text-sm leading-relaxed"
                  placeholder="The introductory expertise text..."
                />
                <div className="space-y-2">
                  <label className="text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">Individual Skills (Comma separated)</label>
                  <input
                    value={(formData as any).skills || ""}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#C5C5C5] text-sm"
                    placeholder="React, Next.js, Node.js, TypeScript..."
                  />
                </div>
              </div>
            </div>
            <div className="p-10 bg-[#171717]/40 border border-white/5 rounded-[3rem] backdrop-blur-md space-y-6">
              <h3 className="text-lg font-bold text-[#C5C5C5] tracking-tight">Final Footer Message</h3>
              <textarea
                rows={6}
                value={formData.cta_text_1}
                onChange={(e) => setFormData({ ...formData, cta_text_1: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-[#C5C5C5]/20 outline-none transition-all duration-300 text-[#919191] text-sm leading-relaxed"
                placeholder="Final message to visitors..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageAbout;
