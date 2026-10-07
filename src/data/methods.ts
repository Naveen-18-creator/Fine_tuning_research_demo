import { FineTuningMethodInfo } from '../types';

export const FINE_TUNING_METHODS: FineTuningMethodInfo[] = [
  {
    id: 'full-ft',
    name: 'Full Fine-Tuning',
    shortName: 'Full FT',
    category: 'Full',
    trainableParamsPercent: '100%',
    description: 'Updates every parameter across all layers of the pre-trained neural network.',
    mechanism: 'Gradient descent computes derivatives for all model weights W. Optimizer states (AdamW momentum & variance) must be maintained for 100% of parameters.',
    advantages: [
      'Maximum expressivity and domain adaptation ceiling',
      'No architectural modification or additional latency during inference',
      'Standard baseline approach for deep domain alignment'
    ],
    disadvantages: [
      'Extremely high GPU VRAM consumption (requires 4-8x model size in VRAM)',
      'High risk of catastrophic forgetting of pre-trained general knowledge',
      'Requires storing a complete set of full model weights for each specialized domain'
    ],
    typicalUseCases: ['Foundational domain shifts (e.g. medical/legal corpus with new vocabulary)', 'Massive compute budgets'],
    diagramData: {
      baseModelStatus: 'Trainable',
      adapterStatus: 'None',
      trainableColor: 'bg-emerald-500',
      frozenColor: 'bg-slate-700',
    },
  },
  {
    id: 'lora',
    name: 'LoRA (Low-Rank Adaptation)',
    shortName: 'LoRA',
    category: 'PEFT',
    trainableParamsPercent: '0.01% - 0.5%',
    description: 'Decomposes weight updates into low-rank matrices A and B ($W = W_0 + B \\cdot A$).',
    mechanism: 'Freezes pre-trained weight matrices $W_0 \\in \\mathbb{R}^{d \\times k}$. Injects rank-decomposition matrices $A \\in \\mathbb{R}^{r \\times k}$ and $B \\in \\mathbb{R}^{d \\times r}$ where $r \\ll \\min(d,k)$.',
    advantages: [
      'Reduces trainable parameters by > 99%',
      'Drastically decreases VRAM and optimizer memory requirement',
      'Zero added inference latency (matrices A & B can be merged back into W_0 at inference)',
      'Modular: easily swap specialized adapters on a shared base model'
    ],
    disadvantages: [
      'Hyperparameter sensitive (rank r and scaling factor alpha)',
      'May require rank scaling for ultra-complex domain shifts'
    ],
    typicalUseCases: ['Domain adaptation in finance, law, engineering', 'Multi-tenant LLM serving'],
    diagramData: {
      baseModelStatus: 'Frozen',
      adapterStatus: 'Trainable',
      trainableColor: 'bg-blue-500',
      frozenColor: 'bg-slate-700',
    },
  },
  {
    id: 'qlora',
    name: 'QLoRA (Quantized LoRA)',
    shortName: 'QLoRA',
    category: 'PEFT',
    trainableParamsPercent: '0.01% - 0.5%',
    description: 'Combines 4-bit NormalFloat (NF4) base model quantization with page-optimizers and LoRA adapters.',
    mechanism: 'Base model is quantized to 4-bit NormalFloat (NF4) with Double Quantization. Gradients pass through frozen 4-bit weights to update 16-bit LoRA adapter parameters.',
    advantages: [
      'Enables fine-tuning 65B+ LLMs on a single consumer GPU (e.g. 48GB/24GB VRAM)',
      'Near 100% preservation of Full Fine-Tuning accuracy',
      'Lowest memory footprint of any parameter-efficient method'
    ],
    disadvantages: [
      'Slightly slower training throughput per token due to dequantization overhead on forward pass',
      'Requires CUDA support for custom 4-bit kernels during training'
    ],
    typicalUseCases: ['Resource-constrained LLM adaptation', 'Fine-tuning large 7B–70B models on workstation hardware'],
    diagramData: {
      baseModelStatus: 'Quantized (Frozen)',
      adapterStatus: 'Trainable',
      trainableColor: 'bg-cyan-400',
      frozenColor: 'bg-purple-900/60',
    },
  },
  {
    id: 'adapters',
    name: 'Bottleneck Adapters (Houlsby / Pfeiffer)',
    shortName: 'Adapters',
    category: 'PEFT',
    trainableParamsPercent: '0.5% - 3%',
    description: 'Inserts small feed-forward bottleneck layers between transformer attention and MLP modules.',
    mechanism: 'Base transformer layers remain frozen. Small residual adapter blocks with down-projection and up-projection ($d \\rightarrow m \\rightarrow d$) are added after multi-head attention and feed-forward sublayers.',
    advantages: [
      'Compact adapter files (~few MBs per domain)',
      'Supports modular stacking and compositional multi-task tuning'
    ],
    disadvantages: [
      'Adds sequential operations resulting in slight inference latency overhead',
      'Higher parameter overhead compared to low-rank LoRA'
    ],
    typicalUseCases: ['Multi-task NLP classification', 'Parameter-constrained edge deployment'],
    diagramData: {
      baseModelStatus: 'Frozen',
      adapterStatus: 'Trainable',
      trainableColor: 'bg-indigo-400',
      frozenColor: 'bg-slate-700',
    },
  },
  {
    id: 'prefix-tuning',
    name: 'Prefix Tuning',
    shortName: 'Prefix Tuning',
    category: 'Prompt-based',
    trainableParamsPercent: '0.1% - 1%',
    description: 'Prepends continuous trainable prefix vectors to key and value representations in key-value attention modules.',
    mechanism: 'Prepends l trainable virtual token embeddings ($P_K, P_V$) to the Key and Value matrices across all attention layers. Base transformer parameters are kept completely frozen.',
    advantages: [
      'Maintains task-specific prefixes for different downstream applications',
      'Base model parameters never mutate'
    ],
    disadvantages: [
      'Reduces total available context window length for user prompts',
      'Can be harder to optimize than weight-space adaptation like LoRA'
    ],
    typicalUseCases: ['Generation tasks (summarization, translation)', 'Multi-tenant prompt routing'],
    diagramData: {
      baseModelStatus: 'Frozen',
      adapterStatus: 'Prefix Trainable',
      trainableColor: 'bg-purple-500',
      frozenColor: 'bg-slate-700',
    },
  },
  {
    id: 'prompt-tuning',
    name: 'Prompt Tuning',
    shortName: 'Prompt Tuning',
    category: 'Prompt-based',
    trainableParamsPercent: '0.001% - 0.05%',
    description: 'Prepends trainable soft prompt embeddings only to the input sequence layer.',
    mechanism: 'Simpler variant of Prefix Tuning: only modifies the input embedding sequence ($k$ soft prompt tokens). Internal transformer layers are untouched.',
    advantages: [
      'Extremely few trainable parameters (often < 100K parameters)',
      'Becomes increasingly effective as base model size increases (>3B parameters)'
    ],
    disadvantages: [
      'Less effective on smaller models (< 1B parameters)',
      'Consumes prompt context length'
    ],
    typicalUseCases: ['Large model prompt optimization', 'Domain steering for 10B+ models'],
    diagramData: {
      baseModelStatus: 'Frozen',
      adapterStatus: 'Prefix Trainable',
      trainableColor: 'bg-fuchsia-400',
      frozenColor: 'bg-slate-700',
    },
  },
  {
    id: 'bitfit',
    name: 'BitFit (Bias-Only Tuning)',
    shortName: 'BitFit',
    category: 'PEFT',
    trainableParamsPercent: '0.05% - 0.1%',
    description: 'Freezes all matrix weights W and only updates the bias terms b across transformer blocks.',
    mechanism: 'For linear transformation $y = Wx + b$, matrix $W$ is held static and gradient updates are applied strictly to vector $b$.',
    advantages: [
      'Minimal implementation complexity',
      'Substantial memory reduction for gradients/optimizer state',
      'No extra parameters added to architecture'
    ],
    disadvantages: [
      'Limited capacity for drastic domain shift adaptation',
      'Plateaus earlier in high-data regimes'
    ],
    typicalUseCases: ['Small dataset fine-tuning', 'Quick task adaptation with low compute'],
    diagramData: {
      baseModelStatus: 'Frozen',
      adapterStatus: 'Bias Only',
      trainableColor: 'bg-amber-400',
      frozenColor: 'bg-slate-700',
    },
  },
];
