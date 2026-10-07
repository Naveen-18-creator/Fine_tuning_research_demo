import React, { useState } from 'react';
import { DEMO_MODELS } from '../data/models';
import { ModelRunResult } from '../types';
import { Columns, Play, RefreshCw, CheckCircle2, Clock, Gauge, Cpu, ShieldCheck } from 'lucide-react';

interface ModelComparisonProps {
  onRunComparison: (selectedIds: string[], prompt: string) => void;
  comparisonResults: Record<string, ModelRunResult>;
  isComparing: boolean;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({
  onRunComparison,
  comparisonResults,
  isComparing,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'smollm2-135m',
    'smollm2-360m',
  ]);

  const [prompt, setPrompt] = useState<string>(
    "Explain how an increase in interest rates can affect the valuation of a company."
  );

  const toggleModelSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // Keep at least 1 model
      setSelectedIds(selectedIds.filter((mId) => mId !== id));
    } else {
      if (selectedIds.length >= 3) return; // Max 3 models to protect laptop RAM
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRunAll = () => {
    if (!prompt.trim() || isComparing) return;
    onRunComparison(selectedIds, prompt);
  };

  return (
    <section className="w-full">
      <div className="paper-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#161b26] text-blue-400 border border-[#263045]">
                <Columns className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400">
                Comparative Analysis
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Model Comparison Matrix
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Evaluate output quality, latency, and tokens/sec across model architectures executed sequentially to protect device memory.
            </p>
          </div>

          <button
            onClick={handleRunAll}
            disabled={isComparing || !prompt.trim()}
            className={`px-5 py-2.5 rounded font-bold text-xs font-mono flex items-center justify-center gap-2 border transition-all ${
              isComparing
                ? 'bg-[#141820] text-slate-500 cursor-not-allowed border-[#222936]'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/30 shadow-sm'
            }`}
          >
            {isComparing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>Executing Sequentially ({selectedIds.length})...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>RUN SEQUENTIAL COMPARISON ({selectedIds.length} Models)</span>
              </>
            )}
          </button>
        </div>

        {/* Laptop Memory Safety Notice */}
        <div className="mb-6 p-3 rounded bg-[#141820] border border-[#222936] text-xs font-mono text-slate-300 flex items-center justify-between">
          <span className="text-slate-400">
            <strong>Laptop Memory Safety Mode:</strong> Runs models sequentially one-by-one to prevent browser memory/GPU overflow on your laptop.
          </span>
          <span className="text-emerald-400 font-semibold text-[11px] shrink-0 border border-emerald-800 bg-[#101e19] px-2 py-0.5 rounded">
            ● Memory Safe
          </span>
        </div>

        {/* Model Selection Checkboxes */}
        <div className="mb-6 p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Select Models to Compare (1 to 3)</span>
            <span className="text-blue-400">{selectedIds.length} / 3 Selected</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {DEMO_MODELS.map((m) => {
              const isSelected = selectedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleModelSelection(m.id)}
                  className={`p-2.5 rounded border text-left font-mono text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#161b26] border-blue-500/80 text-blue-200 font-semibold'
                      : 'bg-[#090b0e] border-[#1e2433] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.parameters}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'border-slate-700 bg-[#141820]'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="mb-6">
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Evaluation Prompt
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#0d0f14] border border-[#1e2433] text-slate-100 text-sm font-sans focus:outline-none focus:border-blue-500"
            placeholder="Type a comparison prompt..."
          />
        </div>

        {/* Side-by-Side Outputs Columns */}
        <div
          className={`grid gap-4 ${
            selectedIds.length === 1
              ? 'grid-cols-1'
              : selectedIds.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {selectedIds.map((modelId) => {
            const model = DEMO_MODELS.find((m) => m.id === modelId);
            const res = comparisonResults[modelId];

            return (
              <div
                key={modelId}
                className="flex flex-col justify-between rounded-lg bg-[#0d0f14] border border-[#1e2433] p-4 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#1e2433] pb-2.5 mb-3">
                    <div>
                      <h3 className="font-bold text-white text-sm">{model?.name}</h3>
                      <div className="text-[10px] font-mono text-slate-400">{model?.parameters}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161b26] text-slate-300 border border-[#263045]">
                      {model?.architecture}
                    </span>
                  </div>

                  <div className="min-h-[220px] max-h-[300px] overflow-y-auto p-3 rounded bg-[#07080b] border border-[#181d29] font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                    {res?.status === 'loading' || res?.status === 'generating' ? (
                      <div className="py-10 text-center space-y-2 text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-400" />
                        <div className="text-[11px] font-mono">{res.progressText || 'Executing sequentially...'}</div>
                      </div>
                    ) : res?.error ? (
                      <div className="text-rose-400 text-xs py-4">{res.error}</div>
                    ) : res?.output ? (
                      res.output
                    ) : (
                      <span className="text-slate-600 italic">Click &ldquo;Run Sequential Comparison&rdquo; to evaluate...</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e2433] space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Model:</span>
                    <span className="text-slate-200 font-semibold">{model?.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Parameters:</span>
                    <span className="text-blue-400">{model?.parameters}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Load Time:</span>
                    <span className="text-slate-200">{res?.metrics ? `${res.metrics.loadTimeMs} ms` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gen Time:</span>
                    <span className="text-slate-200">{res?.metrics ? `${res.metrics.generationTimeMs} ms` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tokens/Sec:</span>
                    <span className="text-emerald-400 font-bold">{res?.metrics ? `${res.metrics.tokensPerSec}` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Device:</span>
                    <span className="text-amber-400 font-semibold">{res?.metrics ? res.metrics.deviceUsed : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status:</span>
                    <span className={res?.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'}>
                      {res?.status ? res.status.toUpperCase() : 'READY'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
