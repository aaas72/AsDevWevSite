import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FiMail, FiTrash2, FiClock, FiUser, FiInbox } from "react-icons/fi";
import Loading from "../../components/Loading";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const markAsRead = async (id: number) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);
    
    if (!error) {
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);
    
    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#C5C5C5]">Inbox</h2>
          <p className="text-[#919191] text-sm mt-2 tracking-wide font-medium">Manage incoming inquiries and collaborations.</p>
        </div>
        <div className="bg-[#1A1A1A] px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
          <FiInbox className="text-[#919191]" />
          <span className="text-xs font-bold text-[#C5C5C5]">{messages.filter(m => !m.is_read).length} New Messages</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="p-12 text-center bg-[#171717]/40 border border-dashed border-white/10 rounded-[2.5rem]">
              <FiMail className="text-4xl text-[#333] mx-auto mb-4" />
              <p className="text-[#919191] text-sm">Your inbox is empty.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.is_read) markAsRead(msg.id);
                }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer group relative ${
                  selectedMessage?.id === msg.id 
                    ? "bg-white border-white text-black" 
                    : "bg-[#171717]/40 border-white/5 hover:border-white/10 text-[#C5C5C5]"
                }`}
              >
                {!msg.is_read && (
                  <div className="absolute top-6 right-6 w-2 h-2 bg-blue-500 rounded-full" />
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold tracking-tight ${selectedMessage?.id === msg.id ? "text-black" : "text-white"}`}>
                      {msg.name}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${selectedMessage?.id === msg.id ? "text-gray-600" : "text-[#919191]"}`}>
                    {msg.email}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold ${selectedMessage?.id === msg.id ? "text-gray-400" : "text-[#555]"}`}>
                      <FiClock /> {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(msg.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-2 transition-all ${selectedMessage?.id === msg.id ? "text-red-500 hover:bg-red-50" : "text-[#919191] hover:text-red-400"}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-[#171717]/40 border border-white/5 rounded-[2.5rem] p-10 space-y-10 min-h-[60vh] backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl text-[#C5C5C5] border border-white/5">
                    <FiUser />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{selectedMessage.name}</h3>
                    <p className="text-[#919191] font-medium">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[#919191] uppercase tracking-[0.3em] flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <FiClock /> {new Date(selectedMessage.created_at).toLocaleString()}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-[#919191] uppercase tracking-[0.4em]">Message Content</h4>
                <div className="text-lg text-[#C5C5C5] leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 flex gap-4">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="px-8 py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <FiMail /> Reply via Email
                </a>
                <button 
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <FiTrash2 /> Delete Message
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 bg-[#171717]/20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-[#333] text-4xl mb-6">
                <FiMail />
              </div>
              <h3 className="text-xl font-bold text-[#C5C5C5] mb-2">No Message Selected</h3>
              <p className="text-[#919191] max-w-xs">Select a message from the list on the left to read its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;
