const Header = () => {
  return (
    <header className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent z-10 pointer-events-none"></div>


      {/* Hero Content with Primary H1 and Visible Arabic Identity */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#E5E5E5] mb-2 sm:mb-3 tracking-tight">
          Abdellah Sheikh
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-[#C5C5C5] font-light tracking-wide mb-4 sm:mb-6">
          Software Engineer
        </p>
        <p className="text-base sm:text-lg md:text-xl text-[#C5C5C5] max-w-2xl leading-relaxed">
          A software engineer specializing in building high-performance web systems, MVPs, and modern digital architectures. Transforming vision into scalable engineering solutions.
        </p>
      </div>
    </header>
  );
};

export default Header;
