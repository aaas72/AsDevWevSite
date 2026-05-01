import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A] main-app noise">
      <div className="relative flex flex-col items-center">
        {/* Logo Text with Pulse Effect */}
        <h1 className="text-4xl font-bold tracking-[0.5em] text-[#C5C5C5] animate-pulse">
          AS.DEV
        </h1>
        
        {/* Minimal Progress Bar */}
        <div className="mt-8 w-48 h-[1px] bg-white/5 overflow-hidden">
          <div className="w-full h-full bg-[#C5C5C5] origin-left animate-loading-bar"></div>
        </div>
        
        {/* Status Text */}
        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[#555] font-bold">
          Synchronizing Experience
        </p>
      </div>
      
      {/* CSS Animation for the Loading Bar */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
