import React from 'react';
import { ArrowDown, Cpu, Sparkles, AlertOctagon, CheckCircle2, ShieldAlert, Zap, Database } from 'lucide-react';

export const ScratchVsFineTuning: React.FC = () => {
  return (
    <section className="w-full">
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 bg-slate-950/80 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertOctagon className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-rose-400">
                Methodology Comparison
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Why Start From Scratch?
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Contrasting petabyte-scale pretraining from scratch against parameter-efficient domain adaptation.
            </p>
          </div>
        </div>

        {/* Side by Side Comparative Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Train From Scratch */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-rose-900/50 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="font-mono font-bold text-rose-400 text-sm tracking-wider uppercase flex items-center gap-2">
                  <Database className="w-4 h-4 text-rose-400" />
                  TRAIN FROM SCRATCH
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                  High Overhead Baseline
                </span>
              </div>

              {/* Step Sequence Flow */}
              <div className="space-y-3 font-mono text-xs text-center">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  1. Random Initialization (W ~ N(0, σ²))
                </div>
                <ArrowDown className="w-4 h-4 text-slate-600 mx-auto" />

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  2. Petabyte-Scale Corpus (3T+ Tokens)
                </div>
                <ArrowDown className="w-4 h-4 text-slate-600 mx-auto" />

                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200">
                  3. Massive Compute (1,000s GPU Clusters)
                </div>
                <ArrowDown className="w-4 h-4 text-slate-600 mx-auto" />

                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200">
                  4. Weeks / Months Training Duration
                </div>
                <ArrowDown className="w-4 h-4 text-slate-600 mx-auto" />

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-bold">
                  5. Specialized Domain LLM Output
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <div>• Compute Cost: $100,000 – $5,000,000+</div>
              <div>• VRAM Footprint: Extreme (Requires multi-node FP8/FP16)</div>
              <div>• Carbon Footprint: High ($100+$ Metric Tons $CO_2$)</div>
            </div>
          </div>

          {/* Right Column - PEFT Domain Adaptation */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex flex-col justify-between space-y-4 shadow-xl shadow-emerald-950/10">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="font-mono font-bold text-emerald-400 text-sm tracking-wider uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  FINE-TUNING (PEFT)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Cost-Efficient Paradigm
                </span>
              </div>

              {/* Step Sequence Flow */}
              <div className="space-y-3 font-mono text-xs text-center">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-blue-300 font-semibold">
                  1. Pre-trained Base LLM (SmolLM2 / Qwen)
                </div>
                <ArrowDown className="w-4 h-4 text-emerald-500/60 mx-auto animate-pulse" />

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  2. Targeted Domain Dataset (1K – 50K examples)
                </div>
                <ArrowDown className="w-4 h-4 text-emerald-500/60 mx-auto animate-pulse" />

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 font-bold">
                  3. Inject PEFT Adapter (LoRA / QLoRA)
                </div>
                <ArrowDown className="w-4 h-4 text-emerald-500/60 mx-auto animate-pulse" />

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-200">
                  4. Low Compute (1 – 6 GPU Hours on 1x GPU)
                </div>
                <ArrowDown className="w-4 h-4 text-emerald-500/60 mx-auto animate-pulse" />

                <div className="p-3 rounded-lg bg-emerald-900/60 border border-emerald-400 text-white font-extrabold shadow-lg">
                  5. High-Performing Domain Adaptation
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/60 text-[11px] text-emerald-300 font-mono space-y-1">
              <div>• Compute Cost: $10 – $50 USD</div>
              <div>• VRAM Footprint: Low (&lt; 16GB VRAM on consumer GPUs)</div>
              <div>• Carbon Footprint: Minimal (&lt; 5 kWh Energy)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
