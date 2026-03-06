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


export default function Navbar() {
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      if (position > prevScrollPosition) {
        setScrollDirection("down");
      } else if (position < prevScrollPosition) {
        setScrollDirection("up");
      }

      setPrevScrollPosition(position);
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPosition, scrollDirection]);

  // تحسين كلاسات الشعار للتجاوب على جميع الشاشات
  const logoClasses = `logo-container flex justify-start items-center transition-all duration-500 ${
    scrollPosition > 50 && scrollDirection === "down"
      ? "opacity-0 -translate-x-full xs:opacity-100 xs:translate-x-0"
      : "translate-x-0 opacity-100"
  }`;

  // تحسين كلاسات عناصر التنقل للتجاوب على الشاشات المتوسطة والكبيرة
  const navItemsClasses = `nav-items-container my-auto hidden sm:flex items-center rounded-full bg-[#1E1E1E]/40 backdrop-blur-md border border-[#C5C5C5]/60 transition-all duration-500
    h-11 sm:h-12 md:h-14 lg:h-16 pl-2 pr-2 gap-3 sm:gap-5 md:gap-6 w-fit sm:w-fit sm:max-w-none sm:justify-self-center
    ${
      scrollPosition > 150 && scrollDirection === "down"
        ? "sm:-translate-y-2 sm:opacity-85 md:translate-y-0 md:opacity-100"
        : "translate-y-0 opacity-100"
    }`;

  // تحسين كلاسات الروابط الاجتماعية للتجاوب على جميع الشاشات
  const socialClasses = `social-container hidden sm:flex justify-end items-center space-x-2 xs:space-x-3 sm:space-x-4 text-[#C5C5C5] transition-all duration-500 ${
    scrollPosition > 50 && scrollDirection === "down"
      ? "opacity-0 translate-x-full xs:opacity-100 xs:translate-x-0"
      : "translate-x-0 opacity-100"
  }`;

  return (
    <nav aria-label="Primary navigation" className="navbar w-full fixed top-0 z-50 transition-all duration-300">
      {/* تحسين تجاوب حاوية النافبار */}
      <div className="navbar-container max-w-[1440px] min-h-[60px] xs:min-h-[70px] sm:min-h-[80px] md:min-h-[90px] lg:min-h-[100px] xl:min-h-[120px] mx-auto flex sm:grid sm:grid-cols-[auto_1fr_auto] items-center justify-between px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Logo */}
        <div className={logoClasses}>
          <h1 className="logo text-xl xs:text-2xl sm:text-2xl md:text-3xl font-semibold text-[#C5C5C5]">AS.DEV</h1>
        </div>

        {/* Mobile Menu Button - تحسين حجم الزر على الشاشات المختلفة */}
        <button 
          className="sm:hidden text-[#C5C5C5] p-2 rounded-full backdrop-blur-md bg-[#1E1E1E]/40 border border-[#C5C5C5]/20 focus:outline-none z-50" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? (
            <FaTimes className="h-6 w-6 xs:h-8 xs:w-8" />
          ) : (
            <FaBars className="h-6 w-6 xs:h-8 xs:w-8" />
          )}
        </button>

        {/* Mobile Menu - تحسين تجاوب القائمة المتنقلة */}
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
            
            {/* تحسين تجاوب الروابط الاجتماعية في القائمة المتنقلة */}
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

        {/* Desktop Navigation Links - تحسين تجاوب روابط التنقل */}
        <div className={navItemsClasses}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-item text-sm sm:text-base md:text-lg text-[#C5C5C5] px-3 md:px-4 py-2 rounded-full transition-all duration-300
                  ${isActive ? "bg-[#C5C5C5]/10" : "hover:bg-[#C5C5C5]/20"}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Social Links & Languages - تحسين تجاوب الروابط الاجتماعية واللغات */}
        <div className={socialClasses}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="social-item hover:text-white transition-colors duration-300 text-xs xs:text-sm sm:text-base"
            >
              {social.name}
            </a>
          ))}

        </div>
      </div>
    </nav>
  );
}
