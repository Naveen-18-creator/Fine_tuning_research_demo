import React, { useState } from 'react';
import { ResearchResultRow } from '../types';
import { ILLUSTRATIVE_RESULTS } from '../data/illustrativeResults';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart2, FileUp, AlertCircle, CheckCircle } from 'lucide-react';
import { calculateCostEfficiency, formatParamCount } from '../lib/metrics';

interface CostPerformanceLabProps {
  customResults: ResearchResultRow[];
  onOpenImporter: () => void;
}

export const CostPerformanceLab: React.FC<CostPerformanceLabProps> = ({
  customResults,
  onOpenImporter,
}) => {
  const [dataMode, setDataMode] = useState<'Illustrative' | 'ResearchData'>(
    customResults.length > 0 ? 'ResearchData' : 'Illustrative'
  );

  const activeDataset =
    dataMode === 'ResearchData' && customResults.length > 0 ? customResults : ILLUSTRATIVE_RESULTS;

  const colorMap: Record<string, string> = {
    'Train from Scratch': '#f43f5e',
    'Full Fine-Tuning': '#f59e0b',
    LoRA: '#3b82f6',
    QLoRA: '#06b6d4',
    Adapters: '#8b5cf6',
    'Prefix Tuning': '#a855f7',
    BitFit: '#10b981',
  };

  const topRoiMethod = [...activeDataset].sort(
    (a, b) =>
      calculateCostEfficiency(b.performance_score, b.estimated_cost_usd) -
      calculateCostEfficiency(a.performance_score, a.estimated_cost_usd)
  )[0];

  return (
    <section className="w-full">
      <div className="paper-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#161b26] text-blue-400 border border-[#263045]">
                <BarChart2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400">
                Primary Research Evaluation
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Cost-Performance Lab
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Evaluating the Pareto trade-off: Estimated/Measured Training Cost (USD) vs. Domain Task Accuracy Score.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center p-1 rounded bg-[#0d0f14] border border-[#1e2433]">
              <button
                type="button"
                onClick={() => setDataMode('Illustrative')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                  dataMode === 'Illustrative'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                MODE A: Illustrative
              </button>
              <button
                type="button"
                onClick={() => setDataMode('ResearchData')}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                  dataMode === 'ResearchData'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                MODE B: Research Data ({customResults.length})
              </button>
            </div>

            <button
              onClick={onOpenImporter}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#161b26] hover:bg-[#1f2738] text-slate-100 border border-[#263045] transition-all"
            >
              <FileUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Import Dataset</span>
            </button>
          </div>
        </div>

        {dataMode === 'Illustrative' ? (
          <div className="mb-6 p-3 rounded bg-[#1a1512] border border-amber-800/60 text-amber-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>ILLUSTRATIVE DEMO MODE:</strong> Plotted values represent architectural estimations — not live experimental benchmark data. Switch to MODE B to import your CSV/JSON training logs.
            </span>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded bg-[#101e19] border border-emerald-800/60 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              <strong>RESEARCH DATA MODE:</strong> Visualizing {activeDataset.length} experiment data points loaded from imported dataset.
            </span>
          </div>
        )}

        <div className="h-[380px] w-full bg-[#07080b] p-4 rounded border border-[#181d29] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
              <XAxis
                type="number"
                dataKey="estimated_cost_usd"
                name="Estimated Cost"
                unit=" USD"
                stroke="#64748b"
                fontSize={11}
                fontFamily="Fira Code"
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                type="number"
                dataKey="performance_score"
                name="Domain Score"
                domain={[50, 100]}
                stroke="#64748b"
                fontSize={11}
                fontFamily="Fira Code"
                unit="%"
              />
              <ZAxis type="number" dataKey="trainable_percent" range={[80, 500]} name="Trainable %" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row: ResearchResultRow = payload[0].payload;
                    return (
                      <div className="p-3 rounded border border-[#1e2433] bg-[#0d0f14] font-mono text-xs text-slate-100 shadow-xl space-y-1">
                        <div className="font-bold text-blue-400">{row.method}</div>
                        <div className="text-slate-300">Model: {row.model}</div>
                        <div className="text-emerald-400">Score: {row.performance_score}%</div>
                        <div className="text-slate-300">Cost: ${row.estimated_cost_usd} USD</div>
                        <div className="text-purple-300">
                          Trainable: {formatParamCount(row.trainable_params)} ({row.trainable_percent}%)
                        </div>
                        <div className="text-slate-400">GPU Memory: {row.gpu_memory_gb} GB</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Adaptation Methods" data={activeDataset}>
                {activeDataset.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorMap[entry.method] || '#3b82f6'}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Highest Cost Efficiency
            </div>
            <div className="text-lg font-bold text-white font-mono">{topRoiMethod.method}</div>
            <div className="text-xs text-emerald-400 font-mono font-semibold mt-1">
              Score: {topRoiMethod.performance_score}% @ ${topRoiMethod.estimated_cost_usd} USD
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Yields highest accuracy units per dollar invested.
            </p>
          </div>

          <div className="p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Parameter Reduction
            </div>
            <div className="text-lg font-bold text-blue-400 font-mono">
              99.59% Saved
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              LoRA/QLoRA: 1.47M vs 360M Params
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Massive optimizer state memory reduction in VRAM.
            </p>
          </div>

          <div className="p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Cost Savings Ratio
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              ~15.5x Lower Cost
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              $18.50 QLoRA vs $288 Full FT
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Democratizes LLM adaptation on workstation GPUs.
            </p>
          </div>

          <div className="p-4 rounded bg-[#0d0f14] border border-[#1e2433]">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Performance Retention
            </div>
            <div className="text-lg font-bold text-purple-400 font-mono">
              98.5% Accuracy
            </div>
            <div className="text-xs text-slate-300 font-mono mt-1">
              78.6% LoRA vs 79.8% Full FT
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">
              Negligible drop in domain benchmarking capability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
