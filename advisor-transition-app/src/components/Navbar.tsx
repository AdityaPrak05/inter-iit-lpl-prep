import React from 'react';
import { ShieldCheck, FileText, Download, Sliders, Activity } from 'lucide-react';

interface NavbarProps {
  onOpenProposal: () => void;
  onOpenControls: () => void;
  onExportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProposal,
  onOpenControls,
  onExportData,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-[#090D16] sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center font-bold text-black text-sm tracking-tighter">
            LPL
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-mono font-bold tracking-wider text-sm sm:text-base">
                ADVISOR TRANSITION INTELLIGENCE
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-800">
                PROD v2.4
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono tracking-tight hidden sm:block">
              Inter IIT Tech Meet 15.0 // Net Value & Longevity Transition Engine
            </p>
          </div>
        </div>

        {/* Engine Status Indicators */}
        <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-zinc-400 bg-zinc-900/80 px-2.5 py-1 border border-zinc-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>US TAX ENGINE: 2024/2026 TCJA</span>
          </div>
          <div className="flex items-center space-x-1.5 text-zinc-400 bg-zinc-900/80 px-2.5 py-1 border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURE 2.0 RMD COMPLIANT</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenControls}
            className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 px-3 py-1.5 text-xs font-mono tracking-wide transition-colors"
            title="Adjust simulation parameters"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">PARAMS</span>
          </button>

          <button
            onClick={onExportData}
            className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 px-3 py-1.5 text-xs font-mono tracking-wide transition-colors"
            title="Export full CSV & JSON dataset"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">EXPORT</span>
          </button>

          <button
            onClick={onOpenProposal}
            className="flex items-center space-x-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold px-3 py-1.5 text-xs font-mono tracking-wide transition-colors border border-cyan-400"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PROPOSAL</span>
          </button>
        </div>
      </div>
    </header>
  );
};
