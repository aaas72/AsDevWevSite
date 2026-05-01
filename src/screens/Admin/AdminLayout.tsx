import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  FiGrid, 
  FiBookOpen, 
  FiFolder, 
  FiUser, 
  FiTool, 
  FiLogOut,
  FiMail
} from "react-icons/fi";
import { supabase } from "../../lib/supabase";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setScrollPosition] = useState(0);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      if (position > prevScrollPosition && position > 50) {
        setScrollDirection("down");
      } else if (position < prevScrollPosition) {
        setScrollDirection("up");
      }
      setPrevScrollPosition(position);
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPosition]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { label: "Dash", path: "/admin/dashboard", icon: <FiGrid /> },
    { label: "Inbox", path: "/admin/messages", icon: <FiMail /> },
    { label: "Projects", path: "/admin/projects", icon: <FiFolder /> },
    { label: "Blogs", path: "/admin/blogs", icon: <FiBookOpen /> },
    { label: "About", path: "/admin/about", icon: <FiUser /> },
    { label: "Tools", path: "/admin/tools", icon: <FiTool /> },
  ];

  // Logic to hide/show side elements
  const sideElementsClass = `transition-all duration-500 transform ${
    scrollDirection === "down" ? "opacity-0 translate-y-[-10px] pointer-events-none" : "opacity-100 translate-y-0"
  }`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] main-app noise text-[#C5C5C5] font-sans selection:bg-[#C5C5C5] selection:text-black">
      {/* Top Navigation - Replicating the Main Navbar Style */}
      <nav className="w-full fixed top-0 z-50 pt-6 px-6 pointer-events-none">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          
          {/* Logo Section */}
          <div className={`${sideElementsClass} logo-container hidden sm:flex items-center gap-2 group pointer-events-auto`}>
            <Link to="/" className="flex items-center gap-3">
              <h1 className="logo text-2xl font-bold text-[#C5C5C5] tracking-tighter">AS.DEV <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-[#919191]">Admin</span></h1>
            </Link>
          </div>

          {/* Centered Pill Navigation */}
          <div className="nav-items-container flex items-center rounded-full bg-[#1E1E1E]/40 backdrop-blur-md border border-[#C5C5C5]/20 h-14 pl-2 pr-2 gap-1 sm:gap-2 mx-auto sm:mx-0 pointer-events-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-all duration-500 ${
                    isActive 
                      ? "bg-[#C5C5C5]/10 text-white" 
                      : "text-[#919191] hover:text-[#C5C5C5] hover:bg-[#C5C5C5]/5"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Section */}
          <div className={`${sideElementsClass} hidden sm:flex justify-end items-center pointer-events-auto`}>
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 text-[#919191] hover:text-red-400 transition-colors duration-300 text-xs font-bold uppercase tracking-widest"
            >
              <FiLogOut className="text-lg group-hover:translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Added padding to account for fixed navbar */}
      <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-24">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-fit">
        <div className="bg-[#1E1E1E]/80 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
           <button 
              onClick={handleLogout}
              className="p-3 text-red-500"
            >
              <FiLogOut className="text-xl" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
