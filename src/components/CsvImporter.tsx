import React, { useState, useRef } from 'react';
import { ResearchResultRow } from '../types';
import { parseCsvOrJsonContent, exportResultsToCsv, ParseResult } from '../lib/csvParser';
import { FileUp, Download, X, AlertTriangle, CheckCircle, Table, RefreshCw, UploadCloud } from 'lucide-react';

interface CsvImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetImported: (rows: ResearchResultRow[]) => void;
  currentDataset: ResearchResultRow[];
}

export const CsvImporter: React.FC<CsvImporterProps> = ({
  isOpen,
  onClose,
  onDatasetImported,
  currentDataset,
}) => {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const result = parseCsvOrJsonContent(content, file.name);
        setParseResult(result);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleApplyDataset = () => {
    if (parseResult && parseResult.data.length > 0) {
      onDatasetImported(parseResult.data);
      onClose();
    }
  };

  const handleExportCsv = () => {
    const csvContent = exportResultsToCsv(currentDataset);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `peft_experiment_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Import Experimental Results</h3>
              <p className="text-xs text-slate-400">
                Upload custom CSV or JSON experimental benchmarks to plot in Cost-Performance Lab
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-950/30'
              : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.json"
            className="hidden"
          />
          <UploadCloud className="w-10 h-10 text-blue-400 mx-auto mb-3 animate-bounce" />
          <p className="text-sm font-semibold text-slate-200 mb-1">
            Drag &amp; drop your experimental dataset file here
          </p>
          <p className="text-xs text-slate-400">
            Supports <span className="font-mono text-blue-300">.csv</span> or <span className="font-mono text-purple-300">.json</span> files
          </p>
        </div>

        {/* Validation Feedback & Warnings */}
        {parseResult && (
          <div className="mt-5 space-y-3">
            {parseResult.errors.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Errors Found:
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {parseResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {parseResult.warnings.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-800 text-amber-300 text-xs font-mono">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Warnings / Fallbacks:
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {parseResult.warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {parseResult.data.length > 0 && (
              <div>
                <div className="text-xs font-mono font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Successfully Parsed {parseResult.data.length} Rows (Previewing Below):
                </div>

                {/* Table Preview */}
                <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-left font-mono text-xs text-slate-300">
                    <thead className="bg-slate-900 sticky top-0 text-slate-400">
                      <tr>
                        <th className="p-2 border-b border-slate-800">Method</th>
                        <th className="p-2 border-b border-slate-800">Model</th>
                        <th className="p-2 border-b border-slate-800">Trainable</th>
                        <th className="p-2 border-b border-slate-800">Cost ($)</th>
                        <th className="p-2 border-b border-slate-800">Score (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.data.map((r, i) => (
                        <tr key={i} className="border-b border-slate-900 hover:bg-slate-900/50">
                          <td className="p-2 font-bold text-blue-400">{r.method}</td>
                          <td className="p-2 text-slate-200">{r.model}</td>
                          <td className="p-2 text-purple-300">{r.trainable_percent}%</td>
                          <td className="p-2 text-emerald-400">${r.estimated_cost_usd}</td>
                          <td className="p-2 text-amber-300">{r.performance_score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Current Dataset as CSV</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              disabled={!parseResult || parseResult.data.length === 0}
              onClick={handleApplyDataset}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800 disabled:text-slate-600 shadow-md"
            >
              Apply Dataset to Lab ({parseResult?.data.length || 0} rows)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
