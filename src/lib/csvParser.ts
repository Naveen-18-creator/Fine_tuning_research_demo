import Papa from 'papaparse';
import { ResearchResultRow } from '../types';

export interface ParseResult {
  data: ResearchResultRow[];
  errors: string[];
  warnings: string[];
}

export function parseCsvOrJsonContent(fileContent: string, fileName: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data: ResearchResultRow[] = [];

  const trimmed = fileContent.trim();
  const isJson = fileName.endsWith('.json') || (trimmed.startsWith('[') && trimmed.endsWith(']'));

  if (isJson) {
    try {
      const parsedJson = JSON.parse(fileContent);
      if (!Array.isArray(parsedJson)) {
        errors.push('JSON root element must be an array of experiment objects.');
        return { data: [], errors, warnings };
      }
      parsedJson.forEach((item, idx) => {
        const row = mapRawObjectToResultRow(item, idx + 1, errors, warnings);
        if (row) data.push(row);
      });
    } catch (e: any) {
      errors.push(`Invalid JSON syntax: ${e?.message || 'Parse error'}`);
    }
  } else {
    // CSV parsing using PapaParse
    const parsedCsv = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parsedCsv.errors && parsedCsv.errors.length > 0) {
      parsedCsv.errors.forEach((err) => {
        warnings.push(`Line ${err.row ?? 'N/A'}: ${err.message}`);
      });
    }

    if (parsedCsv.data && Array.isArray(parsedCsv.data)) {
      parsedCsv.data.forEach((item: any, idx: number) => {
        const row = mapRawObjectToResultRow(item, idx + 1, errors, warnings);
        if (row) data.push(row);
      });
    }
  }

  return { data, errors, warnings };
}

function mapRawObjectToResultRow(
  obj: any,
  index: number,
  errors: string[],
  warnings: string[]
): ResearchResultRow | null {
  if (!obj || typeof obj !== 'object') {
    errors.push(`Row ${index}: Invalid entry standard.`);
    return null;
  }

  // Handle key aliases (e.g. trainable_params vs trainable_parameters)
  const method = obj.method || obj.Method || obj.adaptation_method || `Experiment ${index}`;
  const model = obj.model || obj.Model || obj.base_model || 'Custom Model';
  
  const total_params = Number(obj.total_params || obj.total_parameters || obj.TotalParams || 360000000);
  let trainable_params = Number(obj.trainable_params || obj.trainable_parameters || obj.TrainableParams || 0);

  // If trainable_percent is provided but trainable_params missing
  let trainable_percent = Number(obj.trainable_percent || obj.trainable_pct || 0);
  if (trainable_params === 0 && trainable_percent > 0 && total_params > 0) {
    trainable_params = Math.round((trainable_percent / 100) * total_params);
  } else if (total_params > 0 && trainable_params > 0) {
    trainable_percent = parseFloat(((trainable_params / total_params) * 100).toFixed(4));
  }

  const training_time_hours = Number(obj.training_time_hours || obj.training_time || obj.time_hours || 1.0);
  const gpu_hours = Number(obj.gpu_hours || obj.gpu_time || training_time_hours);
  const gpu_memory_gb = Number(obj.gpu_memory_gb || obj.vram_gb || obj.memory_gb || 8.0);
  const estimated_cost_usd = Number(obj.estimated_cost_usd || obj.estimated_cost || obj.cost_usd || 10.0);
  const performance_score = Number(obj.performance_score || obj.performance || obj.score || obj.accuracy || 75.0);

  const f1_score = obj.f1 !== undefined || obj.f1_score !== undefined ? Number(obj.f1 || obj.f1_score) : undefined;
  const accuracy = obj.accuracy !== undefined ? Number(obj.accuracy) : performance_score;
  const perplexity = obj.perplexity !== undefined ? Number(obj.perplexity) : undefined;
  const energy_kwh = obj.energy_kwh !== undefined || obj.energy !== undefined ? Number(obj.energy_kwh || obj.energy) : undefined;

  if (isNaN(performance_score)) {
    warnings.push(`Row ${index}: Performance metric is NaN. Setting fallback value 0.`);
  }

  return {
    id: `custom-${Date.now()}-${index}`,
    method: String(method),
    model: String(model),
    trainable_params: isNaN(trainable_params) ? 1000000 : trainable_params,
    total_params: isNaN(total_params) ? 360000000 : total_params,
    trainable_percent: isNaN(trainable_percent) ? 0.5 : trainable_percent,
    training_time_hours: isNaN(training_time_hours) ? 1 : training_time_hours,
    gpu_hours: isNaN(gpu_hours) ? 1 : gpu_hours,
    gpu_memory_gb: isNaN(gpu_memory_gb) ? 8 : gpu_memory_gb,
    estimated_cost_usd: isNaN(estimated_cost_usd) ? 10 : estimated_cost_usd,
    performance_score: isNaN(performance_score) ? 75 : performance_score,
    f1_score,
    accuracy,
    perplexity,
    energy_kwh,
    isCustom: true,
  };
}

export function exportResultsToCsv(data: ResearchResultRow[]): string {
  const exportable = data.map((row) => ({
    method: row.method,
    model: row.model,
    trainable_params: row.trainable_params,
    total_params: row.total_params,
    trainable_percent: row.trainable_percent,
    training_time_hours: row.training_time_hours,
    gpu_hours: row.gpu_hours,
    gpu_memory_gb: row.gpu_memory_gb,
    estimated_cost_usd: row.estimated_cost_usd,
    performance_score: row.performance_score,
    f1_score: row.f1_score ?? '',
    accuracy: row.accuracy ?? '',
    perplexity: row.perplexity ?? '',
    energy_kwh: row.energy_kwh ?? '',
  }));

  return Papa.unparse(exportable);
}
