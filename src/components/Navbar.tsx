import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/abdellahsheikh/" },
];


// Helper function to detect if the element (or its parents) has a light background
function isElementLight(el: Element): boolean {
  let curr: Element | null = el;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    if (curr.getAttribute("data-theme") === "light") return true;
    if (curr.getAttribute("data-theme") === "dark") return false;

    const style = window.getComputedStyle(curr);
    const bg = style.backgroundColor;

    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

        if (a >= 0.3) {
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          return luminance > 0.55;
        }
      }
    }
    curr = curr.parentElement;
  }
  return false;
}

export default function Navbar() {
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  // High-performance real-time background detection at the exact position of the floating navbar
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const detectNavbarContrast = () => {
      const position = window.pageYOffset;
      if (position > lastScrollY && position > 50) {
        setScrollDirection("down");
      } else if (position < lastScrollY) {
        setScrollDirection("up");
      }
      lastScrollY = position;
      setScrollPosition(position);

      // Check the element directly underneath the center of the floating navbar capsule
      const x = window.innerWidth / 2;
      const y = Math.min(window.innerHeight - 10, 75);

      const elements = document.elementsFromPoint(x, y);
      const underNavbar = elements.find((el) => !el.closest(".navbar"));

      if (underNavbar) {
        setIsLight(isElementLight(underNavbar));
      } else {
        setIsLight(false);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(detectNavbarContrast);
        ticking = true;
      }
    };

    // Initial check on mount / route change
    detectNavbarContrast();
    const timeoutId = setTimeout(detectNavbarContrast, 150);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [location.pathname]);

  // Logo animation & dynamic color classes
  const logoClasses = `logo-container flex justify-start items-center transition-all duration-500 ${
    scrollPosition > 50 && scrollDirection === "down"
      ? "opacity-0 -translate-x-full xs:opacity-100 xs:translate-x-0"
      : "translate-x-0 opacity-100"
  }`;

  // Nav Capsule styling with dynamic contrast & perfect concentric curvature
  const navItemsClasses = `nav-items-container my-auto hidden sm:flex items-center rounded-full backdrop-blur-xl transition-all duration-500
    p-1 sm:p-1.5 gap-1 sm:gap-1.5 md:gap-2 w-fit sm:w-fit sm:max-w-none sm:justify-self-center
    ${
      isLight
        ? "bg-white/90 border border-[#1E1E1E]/20 shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
        : "bg-[#1E1E1E]/40 border border-[#C5C5C5]/60 shadow-lg shadow-black/20"
    }
    ${
      scrollPosition > 150 && scrollDirection === "down"
        ? "sm:-translate-y-2 sm:opacity-85 md:translate-y-0 md:opacity-100"
        : "translate-y-0 opacity-100"
    }`;

  // Social Links container dynamic contrast
  const socialClasses = `social-container hidden sm:flex justify-end items-center space-x-2 xs:space-x-3 sm:space-x-4 transition-all duration-500 ${
    isLight ? "text-[#1E1E1E] font-medium" : "text-[#C5C5C5]"
  } ${
    scrollPosition > 50 && scrollDirection === "down"
      ? "opacity-0 translate-x-full xs:opacity-100 xs:translate-x-0"
      : "translate-x-0 opacity-100"
  }`;

  return (
    <nav aria-label="Primary navigation" className="navbar w-full fixed top-0 z-50 transition-all duration-300">
      <div className="navbar-container max-w-[1440px] min-h-[50px] xs:min-h-[55px] sm:min-h-[65px] md:min-h-[75px] lg:min-h-[85px] mx-auto flex sm:grid sm:grid-cols-[auto_1fr_auto] items-center justify-between px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Logo */}
        <Link to="/" className={logoClasses} title="Abdellah Sheikh | عبداللاه شيخ">
          <span className={`logo text-base xs:text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
            isLight ? "text-[#1E1E1E]" : "text-[#C5C5C5]"
          }`}>
            Abdellah Sheikh
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className={`sm:hidden p-1.5 rounded-full backdrop-blur-md transition-all duration-500 focus:outline-none z-50 ${
            isLight 
              ? "text-[#1E1E1E] bg-white/90 border border-[#1E1E1E]/20 shadow-md" 
              : "text-[#C5C5C5] bg-[#1E1E1E]/40 border border-[#C5C5C5]/20"
          }`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? (
            <FaTimes className="h-5 w-5" />
          ) : (
            <FaBars className="h-5 w-5" />
          )}
        </button>

        {/* Mobile Menu Modal */}
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-hidden={!mobileMenuOpen} className={`fixed inset-0 bg-black bg-opacity-90 z-40 flex flex-col items-center justify-center transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center space-y-4 xs:space-y-6 sm:space-y-8 mt-10 xs:mt-16 sm:mt-20">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`nav-item text-lg xs:text-xl sm:text-2xl text-[#C5C5C5] px-3 xs:px-4 sm:px-5 py-1 xs:py-2 sm:py-3 rounded-full transition-all duration-300
                    ${isActive ? "bg-[#C5C5C5]/10" : "hover:bg-[#C5C5C5]/20"}`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="flex space-x-3 xs:space-x-4 sm:space-x-6 mt-6 xs:mt-8 sm:mt-10">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="social-item text-sm xs:text-base sm:text-lg text-[#C5C5C5] hover:text-white transition-colors duration-300"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links - Dynamic Contrast Capsule */}
        <div className={navItemsClasses}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            
            const linkClasses = isLight
              ? isActive
                ? "bg-[#1E1E1E] text-[#C5C5C5] font-bold shadow-sm"
                : "text-[#1E1E1E] hover:text-[#1E1E1E] hover:bg-[#1E1E1E]/10 font-semibold"
              : isActive
                ? "bg-[#C5C5C5]/10 text-white font-semibold"
                : "text-[#C5C5C5] hover:bg-[#C5C5C5]/20 hover:text-white";

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-item text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-500 ${linkClasses}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Social Links */}
        <div className={socialClasses}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className={`social-item transition-colors duration-500 text-xs sm:text-sm ${
                isLight ? "hover:text-[#1E1E1E]/70" : "hover:text-white"
              }`}
            >
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
