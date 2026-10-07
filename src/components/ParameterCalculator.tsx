import React, { useState } from 'react';
import { Calculator, Lock, Unlock, Layers, Sliders } from 'lucide-react';
import {
  calculateTrainablePercentage,
  calculateFrozenPercentage,
  formatParamCount,
} from '../lib/metrics';
import { DEMO_MODELS } from '../data/models';

export const ParameterCalculator: React.FC = () => {
  const [totalParams, setTotalParams] = useState<number>(360000000);
  const [trainableParams, setTrainableParams] = useState<number>(1470000);

  const trainablePct = calculateTrainablePercentage(trainableParams, totalParams);
  const frozenPct = calculateFrozenPercentage(trainableParams, totalParams);

  const setPresetModel = (paramNum: number) => {
    setTotalParams(paramNum);
    setTrainableParams(Math.round(paramNum * 0.0041));
  };

  const setMethodPreset = (fraction: number) => {
    setTrainableParams(Math.round(totalParams * fraction));
  };

  return (
    <section className="w-full">
      <div className="paper-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#161b26] text-emerald-400 border border-[#263045]">
                <Calculator className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                Interactive Ratio Analysis
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Parameter Efficiency Calculator
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Compute precise ratio of trainable vs frozen parameters across parameter scales.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5 p-5 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Model Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPresetModel(m.paramCountNum)}
                    className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                      totalParams === m.paramCountNum
                        ? 'bg-blue-600 text-white border-blue-400 font-bold'
                        : 'bg-[#07080b] text-slate-400 border-[#1e2433] hover:border-slate-700'
                    }`}
                  >
                    {m.name} ({m.parameters})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Base Model Parameters (N_total)
                </label>
                <span className="text-xs font-mono text-blue-400 font-bold">
                  {formatParamCount(totalParams)} ({totalParams.toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min={50000000}
                max={2000000000}
                step={5000000}
                value={totalParams}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalParams(val);
                  if (trainableParams > val) setTrainableParams(val);
                }}
                className="w-full h-2 bg-[#07080b] rounded appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                PEFT Method Presets
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setMethodPreset(1.0)}
                  className="px-2 py-1 rounded text-xs font-mono bg-[#07080b] border border-[#1e2433] text-amber-400 hover:border-amber-500/50"
                >
                  Full FT (100%)
                </button>
                <button
                  type="button"
                  onClick={() => setMethodPreset(0.0041)}
                  className="px-2 py-1 rounded text-xs font-mono bg-[#07080b] border border-[#1e2433] text-blue-400 hover:border-blue-500/50"
                >
                  LoRA (~0.4%)
                </button>
                <button
                  type="button"
                  onClick={() => setMethodPreset(0.0125)}
                  className="px-2 py-1 rounded text-xs font-mono bg-[#07080b] border border-[#1e2433] text-indigo-400 hover:border-indigo-500/50"
                >
                  Adapters (~1.2%)
                </button>
                <button
                  type="button"
                  onClick={() => setMethodPreset(0.0025)}
                  className="px-2 py-1 rounded text-xs font-mono bg-[#07080b] border border-[#1e2433] text-purple-400 hover:border-purple-500/50"
                >
                  Prefix (~0.25%)
                </button>
                <button
                  type="button"
                  onClick={() => setMethodPreset(0.0008)}
                  className="px-2 py-1 rounded text-xs font-mono bg-[#07080b] border border-[#1e2433] text-emerald-400 hover:border-emerald-500/50"
                >
                  BitFit (~0.08%)
                </button>
                <button
                  type="button"
                  onClick={() => setMethodPreset(0.0003)}
                  className="px-2 py-1 rounded text-xs font-mono bg-[#07080b] border border-[#1e2433] text-cyan-400 hover:border-cyan-500/50"
                >
                  Prompt (~0.03%)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Trainable Parameters (N_train)
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {formatParamCount(trainableParams)} ({trainableParams.toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={totalParams}
                step={10000}
                value={trainableParams}
                onChange={(e) => setTrainableParams(Number(e.target.value))}
                className="w-full h-2 bg-[#07080b] rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div>
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                Calculated Parameter Distribution
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded bg-[#101e19] border border-emerald-500/40 text-center">
                  <div className="text-xs font-mono text-emerald-400 font-semibold mb-1 flex items-center justify-center gap-1">
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" /> Trainable Ratio
                  </div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-emerald-300 font-mono">
                    {trainablePct}%
                  </div>
                  <div className="text-[11px] text-emerald-400/80 font-mono mt-1">
                    {formatParamCount(trainableParams)} params
                  </div>
                </div>

                <div className="p-4 rounded bg-[#07080b] border border-[#181d29] text-center">
                  <div className="text-xs font-mono text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Frozen Base Ratio
                  </div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-slate-200 font-mono">
                    {frozenPct}%
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    {formatParamCount(totalParams - trainableParams)} params
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Parameter Stack Visualizer</span>
                  <span>100% Total ({formatParamCount(totalParams)})</span>
                </div>
                <div className="w-full h-8 bg-[#07080b] rounded border border-[#181d29] overflow-hidden flex relative">
                  <div
                    style={{ width: `${Math.max(1, trainablePct)}%` }}
                    className="h-full bg-emerald-500 transition-all duration-300 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 truncate px-1"
                  >
                    {trainablePct > 5 ? `${trainablePct}%` : ''}
                  </div>
                  <div
                    style={{ width: `${frozenPct}%` }}
                    className="h-full bg-[#1e2433] transition-all duration-300 flex items-center justify-center text-[10px] font-mono text-slate-400 truncate px-1"
                  >
                    {frozenPct > 15 ? `Frozen: ${frozenPct}%` : ''}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded bg-[#07080b] border border-[#181d29] font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  Efficiency Formula:
                </div>
                <div className="text-blue-300 text-sm font-mono">
                  Trainable % = (N_trainable / N_total) × 100 = ({trainableParams.toLocaleString()} / {totalParams.toLocaleString()}) × 100 = {trainablePct}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
