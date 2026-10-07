import React, { useState } from 'react';
import { ResearchResultRow } from '../types';
import { ILLUSTRATIVE_RESULTS } from '../data/illustrativeResults';
import { exportResultsToCsv } from '../lib/csvParser';
import { Table, Search, Download, FileUp, ArrowUpDown, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatParamCount } from '../lib/metrics';

interface ResultsDashboardProps {
  customResults: ResearchResultRow[];
  onOpenImporter: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  customResults,
  onOpenImporter,
}) => {
  const dataset = customResults.length > 0 ? customResults : ILLUSTRATIVE_RESULTS;

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof ResearchResultRow>('performance_score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Method list for dropdown
  const methodOptions = ['All', ...Array.from(new Set(dataset.map((d) => d.method)))];

  const handleSort = (field: keyof ResearchResultRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = dataset
    .filter((row) => {
      const matchesSearch =
        row.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = methodFilter === 'All' || row.method === methodFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleExport = () => {
    const csvStr = exportResultsToCsv(filteredData);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `research_results_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full">
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 bg-slate-950/80 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Table className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
                Empirical Benchmark Database
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Research Result Dashboard
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Searchable, sortable matrix of fine-tuning benchmarks across compute, latency, memory, and task accuracy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenImporter}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md border border-blue-400/30"
            >
              <FileUp className="w-4 h-4" />
              <span>Import Results</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search method or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-400">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none"
            >
              {methodOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Matrix Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th
                  onClick={() => handleSort('method')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Method <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('model')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Model <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('trainable_params')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Trainable Params <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('training_time_hours')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Time (Hrs) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gpu_memory_gb')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    GPU Mem (GB) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('estimated_cost_usd')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Cost ($) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('f1_score')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    F1 Score <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('accuracy')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Accuracy <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('perplexity')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Perplexity <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-blue-400">{row.method}</td>
                  <td className="p-3 text-slate-100">{row.model}</td>
                  <td className="p-3 text-purple-300">
                    {formatParamCount(row.trainable_params)} ({row.trainable_percent}%)
                  </td>
                  <td className="p-3 text-slate-300">{row.training_time_hours} hrs</td>
                  <td className="p-3 text-cyan-300">{row.gpu_memory_gb} GB</td>
                  <td className="p-3 text-emerald-400 font-bold">${row.estimated_cost_usd}</td>
                  <td className="p-3 text-amber-300">
                    {row.f1_score !== undefined ? row.f1_score : 'N/A'}
                  </td>
                  <td className="p-3 text-emerald-300 font-semibold">{row.accuracy}%</td>
                  <td className="p-3 text-slate-400">
                    {row.perplexity !== undefined ? row.perplexity : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
