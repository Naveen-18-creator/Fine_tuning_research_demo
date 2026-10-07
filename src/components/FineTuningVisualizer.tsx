import React, { useState } from 'react';
import { FINE_TUNING_METHODS } from '../data/methods';
import { Layers, CheckCircle2, XCircle, Info, Cpu, GitCommit } from 'lucide-react';

export const FineTuningVisualizer: React.FC = () => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('lora');

  const selectedMethod = FINE_TUNING_METHODS.find((m) => m.id === selectedMethodId) || FINE_TUNING_METHODS[1];

  return (
    <section className="w-full">
      <div className="paper-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#161b26] text-purple-400 border border-[#263045]">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-purple-400">
                Architectural Breakdown
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              How Lightweight Fine-Tuning Works
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Interactive transformer block parameter visualization comparing full weight updates vs low-rank adapter injection.
            </p>
          </div>
        </div>

        {/* Method Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-2 rounded bg-[#0d0f14] border border-[#1e2433]">
          {FINE_TUNING_METHODS.map((method) => {
            const isActive = method.id === selectedMethodId;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethodId(method.id)}
                className={`px-3.5 py-2 rounded font-mono text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161b26]'
                }`}
              >
                {method.shortName}
              </button>
            );
          })}
        </div>

        {/* Selected Method Detail Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Transformer Block Diagram */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <span>{selectedMethod.name}</span>
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#161b26] text-blue-300 border border-[#263045]">
                    {selectedMethod.category}
                  </span>
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Trainable Params: {selectedMethod.trainableParamsPercent}
                </span>
              </div>

              <div className="space-y-4 py-4">
                {/* Base Transformer Block */}
                <div className="relative p-5 rounded border border-[#1e2433] bg-[#07080b]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">BASE TRANSFORMER MODEL</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161b26] text-slate-300">
                      Status: {selectedMethod.diagramData.baseModelStatus}
                    </span>
                  </div>

                  <div className="w-full h-8 rounded overflow-hidden flex border border-[#1e2433] relative">
                    <div
                      className={`h-full w-full transition-all duration-300 ${selectedMethod.diagramData.frozenColor} flex items-center justify-center text-xs font-mono font-bold text-slate-100`}
                    >
                      {selectedMethod.diagramData.baseModelStatus === 'Trainable'
                        ? '100% WEIGHT MATRIX (TRAINABLE)'
                        : selectedMethod.diagramData.baseModelStatus === 'Quantized (Frozen)'
                        ? '4-BIT NF4 WEIGHTS (FROZEN & QUANTIZED)'
                        : 'BASE WEIGHT MATRIX (FROZEN)'}
                    </div>
                  </div>
                </div>

                {selectedMethod.diagramData.adapterStatus !== 'None' && (
                  <div className="text-center text-slate-500 font-mono text-sm font-bold">
                    +
                  </div>
                )}

                {selectedMethod.diagramData.adapterStatus !== 'None' && (
                  <div className="p-5 rounded border border-blue-500/40 bg-[#0f172a]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-bold text-blue-300">
                        {selectedMethod.id === 'lora' || selectedMethod.id === 'qlora'
                          ? 'LOW-RANK ADAPTER MATRICES (A × B)'
                          : selectedMethod.id === 'adapters'
                          ? 'BOTTLENECK ADAPTER MODULE'
                          : selectedMethod.id === 'prefix-tuning'
                          ? 'PREFIX ATTENTION VECTORS (K, V)'
                          : selectedMethod.id === 'prompt-tuning'
                          ? 'VIRTUAL PROMPT EMBEDDINGS'
                          : 'BIAS VECTOR PARAMETERS (b)'}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101e19] text-emerald-300 border border-emerald-800">
                        Status: TRAINABLE
                      </span>
                    </div>

                    <div className="w-full h-8 rounded overflow-hidden flex border border-emerald-500/40">
                      <div
                        className={`h-full w-full ${selectedMethod.diagramData.trainableColor} flex items-center justify-center text-xs font-mono font-bold text-white`}
                      >
                        TRAINABLE PARAMETERS ({selectedMethod.trainableParamsPercent})
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#1e2433] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-700 inline-block border border-slate-500" />
                <span className="text-slate-400">Frozen Base Weights</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block border border-blue-300" />
                <span className="text-blue-300 font-bold">Trainable Adapter Parameters</span>
              </div>
            </div>
          </div>

          {/* Theoretical Mechanism & Tradeoffs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded bg-[#0d0f14] border border-[#1e2433]">
              <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-2">
                Mathematical Mechanism
              </h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans mb-3">
                {selectedMethod.mechanism}
              </p>
              <div className="p-3 rounded bg-[#07080b] border border-[#181d29] text-xs text-slate-400 font-mono">
                {selectedMethod.description}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Key Advantages
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedMethod.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
                <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  Trade-offs / Limitations
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedMethod.disadvantages.map((dis, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{dis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
              <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-2">
                Recommended Research Applications
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedMethod.typicalUseCases.map((uc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-[#161b26] border border-[#263045] text-purple-300"
                  >
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
