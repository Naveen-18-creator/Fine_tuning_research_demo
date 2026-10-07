import React, { useState } from 'react';
import { DEMO_MODELS } from '../data/models';
import { FINE_TUNING_METHODS } from '../data/methods';
import { runExperimentSimulation, formatParamCount, formatUsd } from '../lib/metrics';
import { Sliders, Cpu, HardDrive, Clock, DollarSign, AlertCircle } from 'lucide-react';

export const ExperimentSimulator: React.FC = () => {
  const [modelId, setModelId] = useState<string>('smollm2-360m');
  const [methodId, setMethodId] = useState<string>('lora');
  const [datasetSize, setDatasetSize] = useState<number>(10000);
  const [epochs, setEpochs] = useState<number>(3);
  const [targetGpu, setTargetGpu] = useState<
    'NVIDIA A100 (80GB)' | 'NVIDIA T4 (16GB)' | 'NVIDIA RTX 4090 (24GB)' | 'Apple M2 Max (32GB)'
  >('NVIDIA A100 (80GB)');

  const simResult = runExperimentSimulation({
    modelId,
    methodId,
    datasetSize,
    epochs,
    batchSize: 16,
    targetGpu,
  });

  const selectedModel = DEMO_MODELS.find((m) => m.id === modelId);
  const selectedMethod = FINE_TUNING_METHODS.find((m) => m.id === methodId);

  return (
    <section className="w-full">
      <div className="paper-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#161b26] text-amber-400 border border-[#263045]">
                <Sliders className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
                Educational Modeling
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Experiment Simulator
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Simulate GPU VRAM requirements, training duration, and compute budget before submitting real offline jobs.
            </p>
          </div>
          <div className="text-xs font-mono text-amber-300 bg-[#1a1512] px-3 py-1.5 rounded border border-amber-800/60 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Theoretical Simulation Model — Not Live Benchmark</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4 p-5 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Model Architecture
              </label>
              <select
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#07080b] border border-[#181d29] text-slate-100 text-sm focus:outline-none"
              >
                {DEMO_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.parameters})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Adaptation Strategy
              </label>
              <select
                value={methodId}
                onChange={(e) => setMethodId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#07080b] border border-[#181d29] text-slate-100 text-sm focus:outline-none"
              >
                {FINE_TUNING_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.trainableParamsPercent})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Compute Infrastructure Target
              </label>
              <select
                value={targetGpu}
                onChange={(e) => setTargetGpu(e.target.value as any)}
                className="w-full px-3 py-2 rounded bg-[#07080b] border border-[#181d29] text-slate-100 text-sm focus:outline-none"
              >
                <option value="NVIDIA A100 (80GB)">NVIDIA A100 (80GB VRAM)</option>
                <option value="NVIDIA RTX 4090 (24GB)">NVIDIA RTX 4090 (24GB VRAM)</option>
                <option value="NVIDIA T4 (16GB)">NVIDIA T4 (16GB VRAM)</option>
                <option value="Apple M2 Max (32GB)">Apple M2 Max (Unified Memory)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                <span className="font-bold text-slate-300 uppercase">Dataset Size (Examples)</span>
                <span className="text-blue-400 font-bold">{datasetSize.toLocaleString()} samples</span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={datasetSize}
                onChange={(e) => setDatasetSize(Number(e.target.value))}
                className="w-full h-2 bg-[#07080b] rounded appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                <span className="font-bold text-slate-300 uppercase">Training Epochs</span>
                <span className="text-purple-400 font-bold">{epochs} Epochs</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                className="w-full h-2 bg-[#07080b] rounded appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div>
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Simulation Projections ({selectedModel?.name} + {selectedMethod?.shortName})</span>
                <span className="text-amber-400">Estimated Values</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded bg-[#07080b] border border-[#181d29]">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-1">
                    <Cpu className="w-4 h-4 text-blue-400" /> Trainable Params
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {formatParamCount(simResult.trainableParams)}
                  </div>
                  <div className="text-[11px] font-mono text-blue-400 mt-1">
                    {simResult.trainablePercent}% of total parameters
                  </div>
                </div>

                <div className="p-4 rounded bg-[#07080b] border border-[#181d29]">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-1">
                    <HardDrive className="w-4 h-4 text-purple-400" /> Peak GPU VRAM
                  </div>
                  <div className="text-xl font-bold font-mono text-purple-300">
                    {simResult.estimatedMemoryGb} GB
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Target: {targetGpu}
                  </div>
                </div>

                <div className="p-4 rounded bg-[#07080b] border border-[#181d29]">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-1">
                    <Clock className="w-4 h-4 text-emerald-400" /> Training Duration
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-300">
                    {simResult.estimatedTrainingTimeHours} GPU Hours
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    ~{simResult.estimatedEnergyKwh} kWh Energy
                  </div>
                </div>

                <div className="p-4 rounded bg-[#07080b] border border-[#181d29]">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mb-1">
                    <DollarSign className="w-4 h-4 text-amber-400" /> Est. Cloud Cost
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-300">
                    {formatUsd(simResult.estimatedComputeCostUsd)}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Based on standard cloud GPU rates
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded bg-[#07080b] border border-[#181d29]">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Computational Burden Complexity Score</span>
                  <span className="font-bold text-amber-400">{simResult.complexityScore} / 100</span>
                </div>
                <div className="w-full h-3 bg-[#0d0f14] rounded overflow-hidden border border-[#1e2433]">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${simResult.complexityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
