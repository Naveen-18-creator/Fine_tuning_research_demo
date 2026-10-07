import React from 'react';
import { ModelInfo } from '../types';
import { DEMO_MODELS } from '../data/models';
import { Cpu, Download, Play, CheckCircle2, HardDrive, ShieldCheck } from 'lucide-react';
import { isModelCached } from '../lib/modelRunner';

interface ModelExplorerProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onLoadModel: (modelId: string) => void;
  onRunDemo: (modelId: string) => void;
  loadingModelId?: string | null;
  loadingProgressText?: string;
  loadingProgressPercent?: number;
}

export const ModelExplorer: React.FC<ModelExplorerProps> = ({
  selectedModelId,
  onSelectModel,
  onLoadModel,
  onRunDemo,
  loadingModelId,
  loadingProgressText,
  loadingProgressPercent,
}) => {
  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Model Explorer
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Select small-footprint foundation language models evaluated for domain adaptation tasks.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-[#141820] px-3 py-1.5 rounded border border-[#222936] self-start md:self-auto">
          Metrics: <span className="text-emerald-400 font-semibold">Measured Locally</span> | <span className="text-amber-400 font-semibold">Approximate</span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {DEMO_MODELS.map((model: ModelInfo) => {
          const isSelected = selectedModelId === model.id;
          const isCached = isModelCached(model.id);
          const isLoadingThis = loadingModelId === model.id;

          return (
            <div
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={`group relative rounded-xl p-4 cursor-pointer flex flex-col justify-between paper-card ${
                isSelected ? 'paper-card-selected' : 'paper-card-hover'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono font-bold tracking-wider">
                  SELECTED
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">
                    {model.name}
                  </h3>
                  {model.isInstruction && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1a1726] text-purple-300 border border-[#302747]">
                      Instruct
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mb-4 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Params:</span>
                    <span className="font-semibold text-blue-400">{model.parameters}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Approx Size:</span>
                    <span className="text-slate-200">{model.approxSize}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Arch:</span>
                    <span className="text-slate-300 truncate max-w-[110px]" title={model.architecture}>
                      {model.architecture}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {model.description}
                </p>
              </div>

              {/* Status & Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-[#1e2433]">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Browser Comp:</span>
                  <span
                    className={`font-semibold ${
                      model.browserCompatibility === 'Excellent'
                        ? 'text-emerald-400'
                        : model.browserCompatibility === 'Good'
                        ? 'text-cyan-400'
                        : model.browserCompatibility === 'Fair'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {model.browserCompatibility}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d0f14] border border-[#1e2433] text-slate-300">
                    WebGPU: {model.webgpuSupported ? 'Yes' : 'No'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d0f14] border border-[#1e2433] text-slate-300">
                    WASM: {model.wasmSupported ? 'Yes' : 'No'}
                  </span>
                </div>

                {isLoadingThis && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-blue-400">
                      <span>{loadingProgressText || 'Loading...'}</span>
                      <span>{loadingProgressPercent || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0d0f14] rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${loadingProgressPercent || 5}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    disabled={isLoadingThis}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadModel(model.id);
                    }}
                    className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                      isCached
                        ? 'bg-[#101e19] text-emerald-400 border border-emerald-800'
                        : 'bg-[#161b26] hover:bg-[#1f2738] text-slate-200 border border-[#263045]'
                    }`}
                  >
                    {isCached ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cached</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        <span>Load</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={isLoadingThis}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunDemo(model.id);
                    }}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Demo</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
