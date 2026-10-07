import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResearchQuestion } from './components/ResearchQuestion';
import { ModelExplorer } from './components/ModelExplorer';
import { ModelPlayground } from './components/ModelPlayground';
import { ModelComparison } from './components/ModelComparison';
import { FineTuningVisualizer } from './components/FineTuningVisualizer';
import { ParameterCalculator } from './components/ParameterCalculator';
import { CostPerformanceLab } from './components/CostPerformanceLab';
import { ExperimentSimulator } from './components/ExperimentSimulator';
import { ScratchVsFineTuning } from './components/ScratchVsFineTuning';
import { ExperimentalProtocol } from './components/ExperimentalProtocol';
import { ResultsDashboard } from './components/ResultsDashboard';
import { PresentationMode } from './components/PresentationMode';
import { DemoGuide } from './components/DemoGuide';
import { CsvImporter } from './components/CsvImporter';
import { Sources } from './components/Sources';

import { BrowserCapabilities, detectBrowserCapabilities } from './lib/browserCapabilities';
import { runBrowserInference } from './lib/modelRunner';
import { ModelRunResult, ResearchResultRow } from './types';

export const App: React.FC = () => {
  const [capabilities, setCapabilities] = useState<BrowserCapabilities | null>(null);

  // Active Model selection
  const [selectedModelId, setSelectedModelId] = useState<string>('smollm2-135m');

  // Loading state tracking
  const [loadingModelId, setLoadingModelId] = useState<string | null>(null);
  const [loadingProgressText, setLoadingProgressText] = useState<string>('');
  const [loadingProgressPercent, setLoadingProgressPercent] = useState<number>(0);

  // Playground state
  const [playgroundResult, setPlaygroundResult] = useState<ModelRunResult | null>(null);
  const [isPlaygroundGenerating, setIsPlaygroundGenerating] = useState<boolean>(false);

  // Comparison state
  const [comparisonResults, setComparisonResults] = useState<Record<string, ModelRunResult>>({});
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Custom imported datasets
  const [customResults, setCustomResults] = useState<ResearchResultRow[]>([]);

  // Modals state
  const [isImporterOpen, setIsImporterOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);

  // Detect browser capabilities on load
  useEffect(() => {
    detectBrowserCapabilities().then((caps) => setCapabilities(caps));
  }, []);

  // Handle single model load request
  const handleLoadModel = async (modelId: string) => {
    setLoadingModelId(modelId);
    setLoadingProgressText('Initializing engine...');
    setLoadingProgressPercent(5);

    try {
      await runBrowserInference(
        modelId,
        'Hello',
        'Auto',
        (progressText, progressPercent) => {
          setLoadingProgressText(progressText);
          setLoadingProgressPercent(progressPercent);
        }
      );
    } catch (err: any) {
      console.error(`Failed to pre-load ${modelId}:`, err);
    } finally {
      setLoadingModelId(null);
    }
  };

  // Run single model playground demo
  const handleRunPlaygroundInference = async (
    modelId: string,
    prompt: string,
    device: 'Auto' | 'WebGPU' | 'WASM'
  ) => {
    setIsPlaygroundGenerating(true);
    setPlaygroundResult({
      modelId,
      output: '',
      status: 'loading',
      progressText: 'Initializing Transformers.js pipeline...',
      progressPercent: 10,
    });

    try {
      const { text, metrics } = await runBrowserInference(
        modelId,
        prompt,
        device,
        (progressText, progressPercent) => {
          setPlaygroundResult({
            modelId,
            output: '',
            status: 'loading',
            progressText,
            progressPercent,
          });
        }
      );

      setPlaygroundResult({
        modelId,
        output: text,
        status: 'completed',
        metrics,
      });
    } catch (err: any) {
      setPlaygroundResult({
        modelId,
        output: '',
        status: 'error',
        error: err?.message || 'Failed to complete browser inference.',
      });
    } finally {
      setIsPlaygroundGenerating(false);
    }
  };

  // Run multi-model side-by-side comparison
  const handleRunComparison = async (selectedIds: string[], prompt: string) => {
    setIsComparing(true);
    const initialMap: Record<string, ModelRunResult> = {};
    selectedIds.forEach((id) => {
      initialMap[id] = {
        modelId: id,
        output: '',
        status: 'loading',
        progressText: 'Queued...',
      };
    });
    setComparisonResults(initialMap);

    // Run sequentially to prevent browser memory exhaustion
    for (const modelId of selectedIds) {
      setComparisonResults((prev) => ({
        ...prev,
        [modelId]: {
          modelId,
          output: '',
          status: 'generating',
          progressText: 'Executing model...',
        },
      }));

      try {
        const { text, metrics } = await runBrowserInference(
          modelId,
          prompt,
          'Auto',
          (progressText) => {
            setComparisonResults((prev) => ({
              ...prev,
              [modelId]: {
                ...prev[modelId],
                progressText,
              },
            }));
          }
        );

        setComparisonResults((prev) => ({
          ...prev,
          [modelId]: {
            modelId,
            output: text,
            status: 'completed',
            metrics,
          },
        }));
      } catch (err: any) {
        setComparisonResults((prev) => ({
          ...prev,
          [modelId]: {
            modelId,
            output: '',
            status: 'error',
            error: err?.message || 'Error executing model',
          },
        }));
      }
    }

    setIsComparing(false);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans bg-grid-pattern selection:bg-blue-600/30 selection:text-white">
      {/* Top Header */}
      <Header
        capabilities={capabilities}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-12">
        {/* Hero & Research Question */}
        <ResearchQuestion />

        {/* Model Explorer */}
        <ModelExplorer
          selectedModelId={selectedModelId}
          onSelectModel={(id) => setSelectedModelId(id)}
          onLoadModel={handleLoadModel}
          onRunDemo={(id) => {
            setSelectedModelId(id);
            const playgroundEl = document.getElementById('playground-section');
            playgroundEl?.scrollIntoView({ behavior: 'smooth' });
          }}
          loadingModelId={loadingModelId}
          loadingProgressText={loadingProgressText}
          loadingProgressPercent={loadingProgressPercent}
        />

        {/* Live Model Playground */}
        <div id="playground-section">
          <ModelPlayground
            selectedModelId={selectedModelId}
            onSelectModel={(id) => setSelectedModelId(id)}
            runResult={playgroundResult}
            onRunInference={handleRunPlaygroundInference}
            isGenerating={isPlaygroundGenerating}
          />
        </div>

        {/* Side-by-side Model Comparison */}
        <ModelComparison
          onRunComparison={handleRunComparison}
          comparisonResults={comparisonResults}
          isComparing={isComparing}
        />

        {/* Fine-Tuning Architectural Visualizer */}
        <FineTuningVisualizer />

        {/* Parameter Efficiency Calculator */}
        <ParameterCalculator />

        {/* Cost-Performance Lab Chart */}
        <CostPerformanceLab
          customResults={customResults}
          onOpenImporter={() => setIsImporterOpen(true)}
        />

        {/* Educational Experiment Simulator */}
        <ExperimentSimulator />

        {/* Scratch vs Fine-Tuning Flow */}
        <ScratchVsFineTuning />

        {/* Proposed Experimental Protocol */}
        <ExperimentalProtocol />

        {/* Empirical Results Database */}
        <ResultsDashboard
          customResults={customResults}
          onOpenImporter={() => setIsImporterOpen(true)}
        />

        {/* Sources & Citations */}
        <Sources />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 px-4 text-center text-xs font-mono text-slate-500 bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            PEFT Cost-Efficiency Lab &copy; {new Date().getFullYear()} — Academic Research Demonstration
          </div>
          <div>
            Powered by React • Transformers.js • WebGPU / WASM
          </div>
        </div>
      </footer>

      {/* Modals & Presentation Overlays */}
      <CsvImporter
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onDatasetImported={(rows) => setCustomResults(rows)}
        currentDataset={customResults}
      />

      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />

      <DemoGuide
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
      />
    </div>
  );
};
