const Header = () => {
  return (
    <header className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70 z-10"></div>

      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
        <div className="flex flex-col items-center leading-[1.11] w-full md:w-[1000px] h-[800px] flex-shrink-0 flex-grow-0">
          <h1 className="text-[200px] sm:text-[300px] md:text-[400px] lg:text-[500px] font-extrabold text-[#C5C5C5] opacity-3 tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">
            <span className="block -mb-20 md:-mb-40">AS.</span>
            <span className="block">DEV</span>
          </h1>
        </div>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center px-4 sm:px-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-[#C5C5C5] mb-4 sm:mb-6">
          Abdellah S.DEV
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[#C5C5C5] max-w-2xl">
          A freelance web developer who excels in building MVPs, micro SaaS
          products, and custom web solutions. I love creating dynamic,
          user-friendly websites and apps that bring your ideas to life and
          drive real value.
        </p>
      </div>
    </header>
  );
};

export default Header;
