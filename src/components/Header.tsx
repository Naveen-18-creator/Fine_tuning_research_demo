import React from 'react';
import { Cpu, BookOpen, Presentation, Layers, Activity } from 'lucide-react';
import { BrowserCapabilities } from '../lib/browserCapabilities';

interface HeaderProps {
  capabilities: BrowserCapabilities | null;
  onOpenPresentation: () => void;
  onOpenDemoGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  capabilities,
  onOpenPresentation,
  onOpenDemoGuide,
}) => {
  const engineText = capabilities
    ? capabilities.hasWebGPU
      ? 'WebGPU Active'
      : 'WASM CPU Engine'
    : 'Detecting Hardware...';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0d12]/95 border-b border-[#1e2433] backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Title and Academic Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-[#161b26] border border-[#263045] text-slate-200">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
                PEFT Cost-Efficiency Lab
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase font-mono font-semibold tracking-wider rounded bg-[#161b26] text-slate-300 border border-[#263045]">
                Research Benchmark
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 font-normal">
              Interactive research evaluation of parameter-efficient adaptation for domain-specific language models
            </p>
          </div>
        </div>

        {/* Action Controls & Hardware Engine Badge */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141820] border border-[#222936] text-xs font-mono">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                capabilities?.hasWebGPU ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-400">Execution Engine:</span>
            <span
              className={`font-semibold ${
                capabilities?.hasWebGPU ? 'text-emerald-400' : 'text-amber-300'
              }`}
            >
              {engineText}
            </span>
          </div>

          {/* Demo Guide Button */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#161b26] hover:bg-[#1f2738] border border-[#263045] text-slate-200 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Demo Guide</span>
          </button>

          {/* Presentation Mode Button */}
          <button
            onClick={onOpenPresentation}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 transition-all shadow-sm"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Presentation Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
