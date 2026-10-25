import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-[#c6c6cd] py-3 px-4 lg:px-6 text-[12px] text-[#45464d] flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="font-bold text-[#0b1c30]">ParkEase Smart Infrastructure OS</span>
        <span>•</span>
        <span>
          Array Management Daemon: <code className="font-mono text-[#0b1c30] font-bold">OK_RUNNING</code>
        </span>
        <span>•</span>
        <span>
          Port: <code className="font-mono text-[#0b1c30]">8080 (Localhost)</code>
        </span>
      </div>
      <div className="flex items-center gap-4 font-mono text-[11px]">
        <span className="flex items-center gap-1 text-[#009668] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#009668] animate-pulse"></span>
          Zero Deadlock Guarantee
        </span>
        <span>Academic Evaluation Ready © 2026</span>
      </div>
    </footer>
  );
};
