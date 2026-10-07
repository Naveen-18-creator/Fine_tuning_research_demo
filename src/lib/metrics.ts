import { SimulationParams, SimulationResult } from '../types';
import { DEMO_MODELS } from '../data/models';
import { FINE_TUNING_METHODS } from '../data/methods';

export function calculateTrainablePercentage(trainableParams: number, totalParams: number): number {
  if (totalParams <= 0) return 0;
  return parseFloat(((trainableParams / totalParams) * 100).toFixed(4));
}

export function calculateFrozenPercentage(trainableParams: number, totalParams: number): number {
  const trainablePct = calculateTrainablePercentage(trainableParams, totalParams);
  return parseFloat((100 - trainablePct).toFixed(4));
}

export function formatParamCount(params: number): string {
  if (params >= 1e9) {
    return `${(params / 1e9).toFixed(2)}B`;
  }
  if (params >= 1e6) {
    return `${(params / 1e6).toFixed(2)}M`;
  }
  if (params >= 1e3) {
    return `${(params / 1e3).toFixed(1)}K`;
  }
  return params.toString();
}

export function formatUsd(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(2)}`;
}

export function calculateCostEfficiency(performance: number, costUsd: number): number {
  if (costUsd <= 0) return 0;
  return parseFloat((performance / costUsd).toFixed(4));
}

export function calculateParameterEfficiency(performance: number, trainableParams: number): number {
  if (trainableParams <= 0) return 0;
  // Expressed as score per million trainable parameters
  const paramsInMillions = trainableParams / 1e6;
  return parseFloat((performance / paramsInMillions).toFixed(3));
}

export function runExperimentSimulation(params: SimulationParams): SimulationResult {
  const model = DEMO_MODELS.find((m) => m.id === params.modelId) || DEMO_MODELS[0];
  const method = FINE_TUNING_METHODS.find((m) => m.id === params.methodId) || FINE_TUNING_METHODS[1];

  const totalParams = model.paramCountNum;

  // Fraction of trainable params based on method
  let trainableFraction = 1.0;
  if (method.id === 'full-ft') trainableFraction = 1.0;
  else if (method.id === 'lora') trainableFraction = 0.004; // 0.4%
  else if (method.id === 'qlora') trainableFraction = 0.004; // 0.4%
  else if (method.id === 'adapters') trainableFraction = 0.012; // 1.2%
  else if (method.id === 'prefix-tuning') trainableFraction = 0.0025; // 0.25%
  else if (method.id === 'prompt-tuning') trainableFraction = 0.0003; // 0.03%
  else if (method.id === 'bitfit') trainableFraction = 0.0008; // 0.08%

  const trainableParams = Math.round(totalParams * trainableFraction);
  const trainablePercent = calculateTrainablePercentage(trainableParams, totalParams);

  // Compute estimates based on hardware, dataset size, and method
  // Dataset scaling: 1k -> 100k
  const datasetScale = params.datasetSize / 1000;
  const epochScale = params.epochs;

  // Base Memory formula (GB):
  // Model weights (fp16 = 2 bytes/param, q4 = 0.5 bytes/param) + gradients + optimizer state (AdamW 8 bytes/trainable param) + activation memory
  let bytesPerModelParam = 2.0; // FP16
  if (method.id === 'qlora') bytesPerModelParam = 0.5; // 4-bit NF4

  const baseWeightMemoryGb = (totalParams * bytesPerModelParam) / 1e9;
  const optimizerAndGradMemoryGb = (trainableParams * 12) / 1e9; // 4 bytes grad + 8 bytes AdamW
  const activationMemoryGb = Math.min(6.0, (totalParams / 1e9) * 2.5);

  const estimatedMemoryGb = parseFloat((baseWeightMemoryGb + optimizerAndGradMemoryGb + activationMemoryGb).toFixed(2));

  // Training Time estimation (GPU Hours):
  // T_train = (FLOPs per token * num_tokens * epochs) / GPU FLOPS
  // Approximate baseline for 10K dataset on single A100:
  const baseGpuHoursPerEpoch10k = (totalParams / 1e9) * (method.id === 'full-ft' ? 3.0 : 0.45);
  const totalGpuHours = Math.max(0.1, (baseGpuHoursPerEpoch10k * (datasetScale / 10) * epochScale));
  
  const estimatedTrainingTimeHours = parseFloat(totalGpuHours.toFixed(2));

  // GPU Hourly rate approximation
  let gpuHourlyCost = 2.0; // $2.00/hr for A100 equivalent cloud GPU
  if (params.targetGpu === 'NVIDIA T4 (16GB)') gpuHourlyCost = 0.35;
  if (params.targetGpu === 'NVIDIA RTX 4090 (24GB)') gpuHourlyCost = 0.80;
  if (params.targetGpu === 'Apple M2 Max (32GB)') gpuHourlyCost = 0.15; // Local energy cost

  const estimatedComputeCostUsd = parseFloat((totalGpuHours * gpuHourlyCost).toFixed(2));

  // Energy consumption (kWh) = (GPU TDP watts * hours) / 1000
  let tdpWatts = 350; // A100
  if (params.targetGpu === 'NVIDIA T4 (16GB)') tdpWatts = 70;
  if (params.targetGpu === 'NVIDIA RTX 4090 (24GB)') tdpWatts = 450;
  if (params.targetGpu === 'Apple M2 Max (32GB)') tdpWatts = 60;

  const estimatedEnergyKwh = parseFloat(((tdpWatts * totalGpuHours) / 1000).toFixed(2));

  // Complexity score (1-100)
  const complexityScore = Math.min(100, Math.round((trainablePercent * 0.4) + (estimatedMemoryGb * 1.5) + (totalGpuHours * 2)));

  return {
    trainableParams,
    totalParams,
    trainablePercent,
    estimatedMemoryGb,
    estimatedTrainingTimeHours,
    estimatedComputeCostUsd,
    estimatedEnergyKwh,
    complexityScore,
  };
}
