export interface BrowserCapabilities {
  hasWebGPU: boolean;
  hasWasm: boolean;
  hardwareConcurrency: number;
  deviceMemoryGb?: number;
  gpuAdapterInfo?: string;
  recommendedEngine: 'WebGPU' | 'WASM';
}

export async function detectBrowserCapabilities(): Promise<BrowserCapabilities> {
  let hasWebGPU = false;
  let gpuAdapterInfo = undefined;

  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    try {
      const gpu = (navigator as unknown as { gpu: { requestAdapter: () => Promise<unknown> } }).gpu;
      const adapter = await gpu.requestAdapter();
      if (adapter) {
        hasWebGPU = true;
        const adapterObj = adapter as Record<string, any>;
        if (adapterObj && 'info' in adapterObj && adapterObj.info) {
          const info = adapterObj.info;
          gpuAdapterInfo = `${info.vendor || ''} ${info.architecture || ''}`.trim() || 'WebGPU Compatible Adapter';
        } else {
          gpuAdapterInfo = 'WebGPU Compatible Hardware';
        }
      }
    } catch {
      hasWebGPU = false;
    }
  }

  const hasWasm = typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
  const hardwareConcurrency = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  const deviceMemoryGb = typeof navigator !== 'undefined' && 'deviceMemory' in navigator
    ? (navigator as unknown as { deviceMemory: number }).deviceMemory
    : undefined;

  return {
    hasWebGPU,
    hasWasm,
    hardwareConcurrency,
    deviceMemoryGb,
    gpuAdapterInfo,
    recommendedEngine: hasWebGPU ? 'WebGPU' : 'WASM',
  };
}
