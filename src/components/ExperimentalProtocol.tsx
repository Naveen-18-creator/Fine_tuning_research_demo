import React from 'react';
import { GitBranch, ArrowRight, ShieldAlert, CheckCircle2, BarChart, Database, Cpu } from 'lucide-react';

export const ExperimentalProtocol: React.FC = () => {
  return (
    <section className="w-full">
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 bg-slate-950/80 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <GitBranch className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400">
                Controlled Scientific Method
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Proposed Experimental Protocol
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Standardized scientific benchmarking controls to ensure valid empirical comparison across adaptation techniques.
            </p>
          </div>
        </div>

        {/* Visual Experimental Protocol Pipeline */}
        <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center font-mono text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
              <div className="font-bold text-blue-400 mb-1">STEP 1</div>
              Unified Domain Dataset
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block mx-auto" />

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
              <div className="font-bold text-purple-400 mb-1">STEP 2</div>
              Fixed Split (80/10/10)
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block mx-auto" />

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
              <div className="font-bold text-indigo-400 mb-1">STEP 3</div>
              Identical Evaluation Metric
            </div>
          </div>

          <div className="my-4 flex justify-center">
            <ArrowRight className="w-5 h-5 text-blue-500 rotate-90" />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-center font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Varying Adaptation Strategy (Controlled Variable)
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Scratch',
                'Full FT',
                'LoRA',
                'QLoRA',
                'Adapters',
                'Prefix Tuning',
                'BitFit',
              ].map((m) => (
                <span
                  key={m}
                  className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-slate-900 border border-slate-700 text-blue-300"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="my-4 flex justify-center">
            <ArrowRight className="w-5 h-5 text-emerald-500 rotate-90" />
          </div>

          {/* Measured Metrics Box */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center font-mono text-xs">
            <div className="font-bold text-emerald-400 uppercase tracking-wider mb-2">
              Recorded Metrics Output Vectors
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <span className="p-2 rounded bg-slate-900 text-slate-200">• Performance (F1 / Acc)</span>
              <span className="p-2 rounded bg-slate-900 text-slate-200">• Training Duration (Hrs)</span>
              <span className="p-2 rounded bg-slate-900 text-slate-200">• Peak GPU Memory (GB)</span>
              <span className="p-2 rounded bg-slate-900 text-slate-200">• Trainable Params (%)</span>
              <span className="p-2 rounded bg-slate-900 text-slate-200">• Compute Cost (USD)</span>
              <span className="p-2 rounded bg-slate-900 text-slate-200">• Energy Draw (kWh)</span>
            </div>
          </div>
        </div>

        {/* Academic Note */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Methodology Distinction Note:</strong> &ldquo;The browser demonstration visualizes the methodology. Actual training results should be generated using controlled offline experiments.&rdquo;
          </div>
        </div>
      </div>
    </section>
  );
};
