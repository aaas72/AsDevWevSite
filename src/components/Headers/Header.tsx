const Header = () => {
  return (
    <header className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70 z-10"></div>

      {/* Background Stylized Typography Watermark */}
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="flex flex-col items-center leading-[1.0] w-full md:w-[1200px] h-[800px] justify-center flex-shrink-0 flex-grow-0 opacity-[0.035]">
          <div className="text-[120px] sm:text-[180px] md:text-[230px] lg:text-[280px] font-black text-[#C5C5C5] tracking-[0.12em] whitespace-nowrap">
            ABDELLAH
          </div>
          <div className="text-[120px] sm:text-[180px] md:text-[230px] lg:text-[280px] font-black text-[#C5C5C5] tracking-[0.12em] whitespace-nowrap -mt-8 sm:-mt-16 md:-mt-24">
            SHEIKH
          </div>
        </div>
      </div>

      {/* Hero Content with Primary H1 and Visible Arabic Identity */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#E5E5E5] mb-2 sm:mb-3 tracking-tight">
          Abdellah Sheikh
        </h1>
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 flex-wrap justify-center">
          <span className="text-xl sm:text-2xl md:text-3xl text-[#C5C5C5] font-light tracking-wide">
            Software Engineer
          </span>
          <span className="text-[#666] hidden xs:inline">•</span>
          <span className="text-xl sm:text-2xl md:text-3xl text-[#A3A3A3] font-medium" dir="rtl">
            عبداللاه شيخ
          </span>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-[#C5C5C5] max-w-2xl leading-relaxed">
          A software engineer specializing in building high-performance web systems, MVPs, and modern digital architectures. Transforming vision into scalable engineering solutions.
        </p>
      </div>
    </header>
  );
};

export default Header;
