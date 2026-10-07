import React, { useState } from 'react';
import { DEMO_MODELS } from '../data/models';
import { ModelRunResult } from '../types';
import { Play, Cpu, RefreshCw, Clock, Gauge, Database, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

interface ModelPlaygroundProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  runResult: ModelRunResult | null;
  onRunInference: (modelId: string, prompt: string, device: 'Auto' | 'WebGPU' | 'WASM') => void;
  isGenerating: boolean;
}

const PRESET_PROMPTS = [
  {
    category: 'Finance',
    prompt: "Explain why an increase in interest rates can affect a company's valuation.",
  },
  {
    category: 'Economics',
    prompt: 'How does quantitative easing influence inflation expectations and currency valuation?',
  },
  {
    category: 'Banking',
    prompt: 'Describe the primary liquidity coverage ratios mandated under regulatory banking frameworks.',
  },
  {
    category: 'Investment',
    prompt: 'Compare discounted cash flow (DCF) valuation with relative EV/EBITDA multiple valuation.',
  },
  {
    category: 'General Knowledge',
    prompt: 'What are the main architectural differences between CNNs and Transformers?',
  },
];

export const ModelPlayground: React.FC<ModelPlaygroundProps> = ({
  selectedModelId,
  onSelectModel,
  runResult,
  onRunInference,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState<string>(PRESET_PROMPTS[0].prompt);
  const [device, setDevice] = useState<'Auto' | 'WebGPU' | 'WASM'>('Auto');

  const selectedModel = DEMO_MODELS.find((m) => m.id === selectedModelId) || DEMO_MODELS[0];

  const handleRun = () => {
    if (!prompt.trim() || isGenerating) return;
    onRunInference(selectedModelId, prompt, device);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Live Model Playground
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Execute finance and domain prompts locally in browser memory to evaluate latency and token outputs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Controls & Input */}
        <div className="lg:col-span-5 space-y-4 paper-card p-5">
          {/* Model Selection Dropdown */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Target Model
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#0d0f14] border border-[#1e2433] text-slate-100 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors"
            >
              {DEMO_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.parameters}) — {m.architecture}
                </option>
              ))}
            </select>
          </div>

          {/* Hardware Target Tabs */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Hardware Engine Target
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Auto', 'WebGPU', 'WASM'] as const).map((dev) => (
                <button
                  key={dev}
                  type="button"
                  onClick={() => setDevice(dev)}
                  className={`py-1.5 px-3 rounded text-xs font-mono font-semibold transition-all border ${
                    device === dev
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-[#0d0f14] text-slate-400 border-[#1e2433] hover:border-slate-700'
                  }`}
                >
                  {dev}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Presets */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Domain Presets
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((preset) => (
                <button
                  key={preset.category}
                  type="button"
                  onClick={() => setPrompt(preset.prompt)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                    prompt === preset.prompt
                      ? 'bg-[#161b26] text-blue-300 border-blue-500 font-semibold'
                      : 'bg-[#0d0f14] text-slate-400 border-[#1e2433] hover:text-slate-200'
                  }`}
                >
                  {preset.category}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Input Prompt
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter finance or domain prompt..."
              className="w-full px-3.5 py-2.5 rounded bg-[#07080b] border border-[#181d29] text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-sans resize-none"
            />
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-3 rounded font-mono font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              isGenerating
                ? 'bg-[#141820] text-slate-500 border-[#222936] cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/30 shadow-sm'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>Executing Inference ({selectedModel.name})...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>RUN MODEL ({selectedModel.name})</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column - Output & Empirical Metrics */}
        <div className="lg:col-span-7 flex flex-col justify-between paper-card p-5 bg-[#0d0f14]">
          <div>
            <div className="flex items-center justify-between border-b border-[#1e2433] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Model Output Stream
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-[#161b26] px-2.5 py-1 rounded border border-[#263045]">
                {selectedModel.name}
              </span>
            </div>

            {/* Response Content Box */}
            <div className="min-h-[220px] p-4 rounded bg-[#07080b] border border-[#181d29] font-mono text-xs md:text-sm leading-relaxed text-slate-200 overflow-y-auto max-h-[360px] whitespace-pre-wrap">
              {runResult?.status === 'loading' || runResult?.status === 'generating' ? (
                <div className="space-y-3 py-8 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-400" />
                  <p className="text-xs font-mono">
                    {runResult?.progressText || 'Executing model inference...'}
                  </p>
                </div>
              ) : runResult?.error ? (
                <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                  <div>
                    <div className="font-bold text-xs">Inference Notice</div>
                    <div className="text-xs text-rose-300/80">{runResult.error}</div>
                  </div>
                </div>
              ) : runResult?.output ? (
                <div>{runResult.output}</div>
              ) : (
                <div className="text-slate-500 text-xs italic py-12 text-center font-sans">
                  Select a prompt and click &ldquo;RUN MODEL&rdquo; to execute inference.
                </div>
              )}
            </div>
          </div>

          {/* Measured Empirical Metrics */}
          <div className="mt-5 pt-4 border-t border-[#1e2433]">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Measured Hardware Metrics</span>
              {runResult?.metrics?.isMeasuredLocally && (
                <span className="text-[10px] text-emerald-400 font-normal border border-emerald-800 bg-[#101e19] px-2 py-0.5 rounded">
                  ● Measured Locally
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-2.5 rounded bg-[#07080b] border border-[#181d29] text-center">
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" /> Load Time
                </div>
                <div className="text-sm font-mono font-bold text-white mt-1">
                  {runResult?.metrics ? `${runResult.metrics.loadTimeMs} ms` : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#07080b] border border-[#181d29] text-center">
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" /> Gen Time
                </div>
                <div className="text-sm font-mono font-bold text-white mt-1">
                  {runResult?.metrics ? `${runResult.metrics.generationTimeMs} ms` : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#07080b] border border-[#181d29] text-center">
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-400" /> Tokens/Sec
                </div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                  {runResult?.metrics ? `${runResult.metrics.tokensPerSec}` : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#07080b] border border-[#181d29] text-center">
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400" /> Tokens
                </div>
                <div className="text-sm font-mono font-bold text-white mt-1">
                  {runResult?.metrics ? `${runResult.metrics.tokensGenerated}` : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#07080b] border border-[#181d29] text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-400" /> Device
                </div>
                <div className="text-xs font-mono font-bold text-amber-300 mt-1">
                  {runResult?.metrics ? runResult.metrics.deviceUsed : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
