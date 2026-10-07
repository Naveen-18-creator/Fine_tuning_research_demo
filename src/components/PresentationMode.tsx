import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  BookOpen,
  Sparkles,
  Zap,
  Layers,
  BarChart2,
  CheckCircle2,
  HelpCircle,
  Database,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { DEMO_MODELS } from '../data/models';
import { FINE_TUNING_METHODS } from '../data/methods';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSection?: (sectionId: string) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  onSwitchToSection,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      title: 'Cost-Efficiency of Lightweight Fine-Tuning vs. Training from Scratch',
      subtitle: 'A Case Study in Domain-Specific Language Models',
      type: 'cover',
      content: (
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold uppercase tracking-widest">
            College Academic Research Defense Demonstration
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Cost-Efficiency of Lightweight Fine-Tuning vs. Training from Scratch
          </h1>
          <p className="text-xl text-slate-300 font-normal leading-relaxed">
            Can parameter-efficient fine-tuning deliver comparable domain adaptation with a fraction of the computational cost?
          </p>
          <div className="pt-6 border-t border-slate-800 flex justify-center items-center gap-8 font-mono text-xs text-slate-400">
            <div>Model Scale: 135M – 1.7B</div>
            <div>•</div>
            <div>Engine: Browser Transformers.js (WebGPU/WASM)</div>
            <div>•</div>
            <div>Focus: Financial Domain Adaptation</div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-2',
      title: 'Research Question & Motivation',
      subtitle: 'The Core Dilemma in Domain-Specific AI',
      type: 'concept',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <blockquote className="p-6 rounded-2xl bg-blue-950/40 border-l-4 border-blue-500 text-2xl font-bold text-slate-100 italic leading-snug">
            &ldquo;Can parameter-efficient fine-tuning achieve useful domain adaptation while dramatically reducing trainable parameters, memory, training time and computational cost?&rdquo;
          </blockquote>

          <div className="grid grid-cols-2 gap-6 pt-4 font-sans">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-rose-400 text-lg mb-2">The Traditional Problem</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Pre-training LLMs from scratch requires millions of dollars, thousands of GPUs, and petabytes of data. Full fine-tuning updates 100% of parameters, requiring massive VRAM for optimizer states.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-emerald-500/40">
              <h3 className="font-bold text-emerald-400 text-lg mb-2">The PEFT Solution</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                PEFT freezes the base model and trains tiny modular adapters ($\le 0.5\%$ parameters), preserving accuracy while reducing compute costs by up to $100\times$.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-3',
      title: 'Why Fine-Tuning over Training from Scratch?',
      subtitle: 'Knowledge Transfer Efficiency',
      type: 'comparison',
      content: (
        <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto font-mono text-sm">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs text-rose-400 font-bold uppercase tracking-wider">
              Train From Scratch Baseline
            </div>
            <ul className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <li>• Random Initialization (W ~ N(0, σ²))</li>
              <li>• Requires 3 Trillion+ General Corpus Tokens</li>
              <li>• Extreme Energy &amp; Cloud GPU Expense ($100k+)</li>
              <li>• Long multi-week training schedules</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-4">
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Parameter-Efficient Fine-Tuning
            </div>
            <ul className="space-y-3 text-emerald-200 text-xs leading-relaxed">
              <li>• Leverage Pre-trained Knowledge Base</li>
              <li>• Specialized Small Dataset (1K – 50K examples)</li>
              <li>• Train &lt; 0.5% Parameters (LoRA/QLoRA)</li>
              <li>• Rapid Iteration: Single Consumer GPU ($10 – $50)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-4',
      title: 'Evaluated Base Models Overview',
      subtitle: 'Small Footprint LLM Spectrum',
      type: 'models',
      content: (
        <div className="grid grid-cols-5 gap-3 max-w-5xl mx-auto font-mono text-xs">
          {DEMO_MODELS.map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <div className="font-bold text-white text-sm">{m.name}</div>
              <div className="text-blue-400 font-bold">{m.parameters}</div>
              <div className="text-slate-400 text-[10px]">{m.approxSize}</div>
              <div className="text-slate-300 text-[10px] pt-2 border-t border-slate-800">{m.architecture}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'slide-5',
      title: 'Method 1: Full Fine-Tuning',
      subtitle: '100% Parameter Mutation Paradigm',
      type: 'method',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="font-bold text-amber-400 uppercase">FULL FINE-TUNING</span>
              <span className="text-emerald-400 font-bold">100% Trainable Parameters</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Updates all weight matrices W across all attention and MLP layers. Stores full AdamW optimizer state (momentum + variance = 8 bytes/param), leading to extreme VRAM footprint.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 font-sans text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">Advantages:</strong>
              Maximum representation capacity and domain shift headroom.
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-rose-400 block mb-1">Disadvantages:</strong>
              Catastrophic forgetting risk, huge GPU requirement, massive storage per checkpoint.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-6',
      title: 'Method 2: Low-Rank Adaptation (LoRA)',
      subtitle: 'Low-Rank Matrix Factorization (W = W_0 + B · A)',
      type: 'method',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-500/50 space-y-4">
            <div className="text-sm font-mono font-bold text-blue-300">
              MATHEMATICAL DECOMPOSITION: W = W_0 + B · A
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              Freezes original pre-trained weight W_0 and injects trainable low-rank decomposition matrices A and B with rank r &lt;&lt; min(d, k).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-blue-400 font-bold text-base">&lt; 0.5%</div>
              <div className="text-slate-400 mt-1">Trainable Params</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-emerald-400 font-bold text-base">0 ms</div>
              <div className="text-slate-400 mt-1">Inference Latency (Merge Weights)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-purple-400 font-bold text-base">&gt; 90%</div>
              <div className="text-slate-400 mt-1">VRAM Memory Savings</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-7',
      title: 'Method 3: QLoRA (Quantized LoRA)',
      subtitle: '4-Bit NF4 Base Model + Double Quantization',
      type: 'method',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 space-y-4">
            <div className="text-sm font-mono font-bold text-cyan-300">
              4-BIT NORMALFLOAT (NF4) &amp; PAGED OPTIMIZERS
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              Base model weights are stored in 4-bit NormalFloat precision. Gradients flow back through frozen 4-bit weights to update 16-bit LoRA adapters. Enables tuning 65B models on consumer GPUs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 text-center">
            Peak VRAM requirement for 360M model fine-tuning drops from 28GB to under 4.5GB!
          </div>
        </div>
      ),
    },
    {
      id: 'slide-8',
      title: 'Other PEFT Alternatives',
      subtitle: 'Adapters, Prefix Tuning, Prompt Tuning, BitFit',
      type: 'peft-family',
      content: (
        <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-indigo-400 text-sm">Bottleneck Adapters</div>
            <p className="text-slate-300 font-sans text-xs">
              Sequential feed-forward down/up projections inserted inside transformer sublayers (~1-3% params).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-purple-400 text-sm">Prefix Tuning</div>
            <p className="text-slate-300 font-sans text-xs">
              Continuous trainable prefix vectors prepended to Attention Key and Value matrices across all blocks.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-fuchsia-400 text-sm">Prompt Tuning</div>
            <p className="text-slate-300 font-sans text-xs">
              Trainable soft prompt embeddings appended strictly to input embedding sequence (&lt; 0.05% params).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400 text-sm">BitFit (Bias-Only)</div>
            <p className="text-slate-300 font-sans text-xs">
              Matrix weights $W$ completely static; updates strictly bias vectors $b$ ($y = Wx + b$).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-9',
      title: 'Cost vs. Performance Frontier',
      subtitle: 'Domain Accuracy Score vs Compute Budget',
      type: 'data',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs text-center">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-lg font-bold text-emerald-400">
              PEFT (LoRA/QLoRA) Achieves ~98.5% of Full FT Performance at ~6.4% of the Compute Cost
            </div>
            <p className="text-slate-300 font-sans text-sm">
              The cost efficiency ratio (Accuracy per Dollar) demonstrates that parameter-efficient fine-tuning is the optimal Pareto strategy for domain adaptation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">Full FT Cost</div>
              <div className="text-xl font-bold text-amber-400 mt-1">$288.00</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">LoRA Cost</div>
              <div className="text-xl font-bold text-blue-400 mt-1">$28.00</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400">QLoRA Cost</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">$18.50</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-10',
      title: 'Scientific Benchmarking Methodology',
      subtitle: 'Controlled Experimental Protocol',
      type: 'protocol',
      content: (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-4xl mx-auto font-mono text-xs space-y-4">
          <div className="text-sm font-bold text-blue-400">EXPERIMENTAL CONTROLS:</div>
          <ul className="space-y-2 text-slate-300 text-left font-sans text-xs">
            <li>✓ Same underlying domain dataset split across all runs.</li>
            <li>✓ Same evaluation benchmarks (Financial QA, Sentiment, Entity Extraction).</li>
            <li>✓ Standardized compute hardware logging (GPU Hours, Peak VRAM, kWh Energy).</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'slide-11',
      title: 'Research Defense Conclusion',
      subtitle: 'Summary of Key Findings',
      type: 'conclusion',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/80 to-purple-950/80 border border-blue-500/40 space-y-4">
            <h3 className="text-xl font-bold text-white">Final Research Verdict</h3>
            <ul className="space-y-3 font-sans text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Democratization:</strong> PEFT enables high-performance domain LLMs to be fine-tuned on single workstation GPUs without petabyte compute budgets.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Parameter Efficiency:</strong> Freezing &gt;99% of weights prevents catastrophic forgetting while maintaining top downstream benchmark accuracy.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Deployment Agility:</strong> Compact adapter checkpoints (&lt; 20MB) allow instant hot-swapping across multiple financial tasks on a shared base model.
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen) return null;

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f] text-slate-100 flex flex-col justify-between p-6 lg:p-12 selection:bg-blue-600/40">
      {/* Top Navigation Control Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
            Presentation Mode
          </span>
          <span className="text-xs font-mono text-slate-400">
            Slide {currentSlide + 1} of {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
            Use ← → arrow keys to navigate
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Content Stage */}
      <div className="my-auto py-8">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            {current.title}
          </h2>
          <p className="text-base md:text-lg text-blue-400 font-mono font-medium">
            {current.subtitle}
          </p>
        </div>

        <div className="w-full">{current.content}</div>
      </div>

      {/* Bottom Control Bar */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
        <button
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide(currentSlide - 1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-200 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        {/* Slide Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          disabled={currentSlide === slides.length - 1}
          onClick={() => setCurrentSlide(currentSlide + 1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:pointer-events-none shadow-md shadow-blue-600/20 transition-all"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
