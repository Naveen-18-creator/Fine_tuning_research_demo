import React from 'react';
import { BookOpen, X, CheckCircle2, Play, ArrowRight, Sparkles } from 'lucide-react';

interface DemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStep?: (stepIndex: number) => void;
}

export const DemoGuide: React.FC<DemoGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Select Base Model (SmolLM2 135M)',
      desc: 'In the Model Explorer or Live Playground, select SmolLM2 135M to test ultra-lightweight on-device execution.',
      code: 'SmolLM2 135M',
    },
    {
      step: 2,
      title: 'Execute Finance Prompt',
      desc: 'Run the prompt: "Explain how an increase in interest rates can affect the valuation of a company."',
      code: 'Explain how an increase in interest rates can affect the valuation of a company.',
    },
    {
      step: 3,
      title: 'Evaluate Medium Model (SmolLM2 360M)',
      desc: 'Select SmolLM2 360M and re-run the prompt to measure token generation latency and context depth gains.',
      code: 'SmolLM2 360M',
    },
    {
      step: 4,
      title: 'Evaluate Qwen2.5 0.5B',
      desc: 'Select Qwen2.5 0.5B to observe multilingual and financial reasoning capacity across model architectures.',
      code: 'Qwen2.5 0.5B',
    },
    {
      step: 5,
      title: 'Side-by-Side Model Comparison',
      desc: 'Open the "COMPARE MODELS" section, select 3 models, and click "RUN ALL" to visualize concurrent execution latency and metrics side-by-side.',
      code: 'Compare Models -> Run All',
    },
    {
      step: 6,
      title: 'Explain PEFT Architecture',
      desc: 'Open "How Lightweight Fine-Tuning Works" and inspect the interactive transformer diagram.',
      code: 'Fine-Tuning Visualizer',
    },
    {
      step: 7,
      title: 'Inspect LoRA Adapter Layer',
      desc: 'Select LoRA tab to demonstrate how freezing the 100% base model weights and adding low-rank matrices A & B cuts VRAM requirements.',
      code: 'Base Model (Frozen) + LoRA Adapter (Trainable)',
    },
    {
      step: 8,
      title: 'Present Cost-Performance Lab',
      desc: 'Open Cost-Performance Lab and state the core research thesis: "The goal of our research is not simply to find the largest model. It is to find the best performance per unit of computational cost."',
      code: 'Cost-Performance Lab',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Recommended Live Demonstration Walkthrough</h3>
              <p className="text-xs text-slate-400">
                Step-by-step guide for presenting this research lab to professors, evaluators, or research panels.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-2">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-4 transition-all hover:border-slate-700"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                {s.step}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-100 text-sm">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{s.desc}</p>
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-950 border border-slate-800 text-blue-300">
                    {s.code}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md"
          >
            Got it, Start Demonstration
          </button>
        </div>
      </div>
    </div>
  );
};
