export interface ModelInfo {
  id: string;
  name: string;
  huggingFaceId: string;
  parameters: string; // e.g. "135M"
  paramCountNum: number; // e.g. 135000000
  approxSize: string; // e.g. "~80 MB (q4)"
  architecture: string; // e.g. "Llama Architecture"
  isInstruction: boolean;
  hfModelPath: string; // HuggingFace repo path for transformers.js
  defaultQuantization: 'q4' | 'q8' | 'fp16' | 'fp32';
  contextLength: number;
  browserCompatibility: 'Excellent' | 'Good' | 'Fair' | 'Requires WebGPU / Heavy';
  webgpuSupported: boolean;
  wasmSupported: boolean;
  description: string;
}

export interface GenerationMetrics {
  loadTimeMs: number;
  generationTimeMs: number;
  tokensGenerated: number;
  tokensPerSec: number;
  deviceUsed: 'WebGPU' | 'WASM' | 'CPU' | 'N/A' | 'Simulated';
  quantizationUsed: string;
  isMeasuredLocally: boolean;
}

export interface ModelRunResult {
  modelId: string;
  output: string;
  status: 'idle' | 'loading' | 'generating' | 'completed' | 'error';
  error?: string;
  metrics?: GenerationMetrics;
  progressPercent?: number;
  progressText?: string;
}

export interface FineTuningMethodInfo {
  id: string;
  name: string;
  shortName: string;
  category: 'Full' | 'PEFT' | 'Prompt-based';
  trainableParamsPercent: string;
  description: string;
  mechanism: string;
  advantages: string[];
  disadvantages: string[];
  typicalUseCases: string[];
  diagramData: {
    baseModelStatus: 'Frozen' | 'Trainable' | 'Quantized (Frozen)';
    adapterStatus: 'None' | 'Trainable' | 'Prefix Trainable' | 'Bias Only';
    trainableColor: string;
    frozenColor: string;
  };
}

export interface ResearchResultRow {
  id: string;
  method: string;
  model: string;
  trainable_params: number; // raw number or count
  total_params: number;
  trainable_percent: number; // calculated or provided
  training_time_hours: number;
  gpu_hours: number;
  gpu_memory_gb: number;
  estimated_cost_usd: number;
  performance_score: number; // e.g. 0-100 score or normalized
  f1_score?: number;
  accuracy?: number;
  perplexity?: number;
  energy_kwh?: number;
  isCustom?: boolean;
}

export interface SimulationParams {
  modelId: string;
  methodId: string;
  datasetSize: number; // number of samples (1K to 100K)
  epochs: number;
  batchSize: number;
  targetGpu: 'NVIDIA A100 (80GB)' | 'NVIDIA T4 (16GB)' | 'NVIDIA RTX 4090 (24GB)' | 'Apple M2 Max (32GB)';
}

export interface SimulationResult {
  trainableParams: number;
  totalParams: number;
  trainablePercent: number;
  estimatedMemoryGb: number;
  estimatedTrainingTimeHours: number;
  estimatedComputeCostUsd: number;
  estimatedEnergyKwh: number;
  complexityScore: number;
}
