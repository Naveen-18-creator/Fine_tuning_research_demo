import React from 'react';
import { HelpCircle, ArrowDown, Database, Layers, CheckCircle2 } from 'lucide-react';

export const ResearchQuestion: React.FC = () => {
  return (
    <section className="w-full">
      <div className="paper-card p-6 md:p-8 relative overflow-hidden">
        {/* Section Tag Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1 rounded bg-[#161b26] text-blue-400 border border-[#263045]">
            <HelpCircle className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400">
            Core Research Question
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight max-w-4xl mb-4 font-sans">
          &ldquo;Can parameter-efficient fine-tuning deliver comparable domain adaptation with a fraction of the computational cost?&rdquo;
        </h2>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl mb-8 font-normal">
          Training specialized domain-specific LLMs from scratch requires petabyte-scale corpora, supercomputing clusters, and millions of GPU hours. Parameter-Efficient Fine-Tuning (PEFT) freezes up to 99.9% of base model weights, training only tiny modular adapters. This benchmark evaluates the cost-performance efficiency frontier across 5 open small language model families.
        </p>

        {/* Three Core Concepts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-[#141820] border border-[#222936]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-slate-400">01 / BASELINE</span>
              <Database className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Train From Scratch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Random weight initialization. Full dataset pretraining ($10^5-10^6$ GPU hours). Highest memory and financial overhead.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#141820] border border-[#222936]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">02 / HEAVY ADAPTATION</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Full Fine-Tuning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mutates 100% of pre-trained parameters on domain text. Requires full optimizer states for all layers. High catastrophic forgetting risk.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#141820] border border-blue-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-blue-400">03 / PARADIGM SHIFT</span>
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-bold text-blue-200 text-base mb-1">Parameter-Efficient FT</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Freezes base model. Injects lightweight adapters ($\le 0.5\%$ parameters). Cut compute cost by up to $100\times$ while matching domain score.
            </p>
          </div>
        </div>

        {/* Visual Adaptation Flow Diagram */}
        <div className="p-5 rounded-lg bg-[#0d0f14] border border-[#1e2433]">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 text-center">
            Adaptation Pipeline Paradigm
          </div>

          <div className="flex flex-col items-center">
            {/* Stage 1 */}
            <div className="px-5 py-2 rounded bg-[#161b26] border border-[#263045] text-slate-200 text-xs font-mono font-semibold">
              Pretraining (General Text Corpus)
            </div>
            <ArrowDown className="w-4 h-4 text-slate-500 my-1.5" />

            {/* Stage 2 */}
            <div className="px-6 py-2.5 rounded bg-[#1c2436] border border-blue-500/40 text-blue-200 text-sm font-bold">
              Base LLM (Pre-trained Foundation Model)
            </div>
            <ArrowDown className="w-4 h-4 text-slate-500 my-1.5" />

            {/* Stage 3 - Split Branches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-1">
              {/* Full FT Branch */}
              <div className="p-4 rounded-lg bg-[#1a1512] border border-amber-800/50 text-center">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Full Fine-Tuning
                </div>
                <div className="text-sm font-semibold text-slate-200 mb-2">
                  Update All Weights
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  100% Parameters Trainable <br />
                  High VRAM &amp; Compute
                </div>
              </div>

              {/* PEFT Branch */}
              <div className="p-4 rounded-lg bg-[#101e19] border border-emerald-500/50 text-center">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  PEFT (LoRA / QLoRA / Adapters)
                </div>
                <div className="text-sm font-semibold text-emerald-200 mb-2">
                  Freeze Base Model + Train Small Adapter
                </div>
                <div className="text-xs text-emerald-300/80 font-mono">
                  &lt; 0.5% Parameters Trainable <br />
                  Dramatic Memory &amp; Cost Reduction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
