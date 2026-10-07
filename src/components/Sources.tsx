import React from 'react';
import { ExternalLink, BookMarked, ShieldCheck } from 'lucide-react';

export const Sources: React.FC = () => {
  const citations = [
    {
      title: 'Transformers.js (v3 Engine)',
      author: 'Hugging Face',
      url: 'https://huggingface.co/docs/transformers.js',
      description: 'In-browser machine learning execution pipeline with WebGPU and WASM support.',
    },
    {
      title: 'WebGPU Standard Specification',
      author: 'W3C WebGPU Working Group',
      url: 'https://w3c.github.io/webgpu/',
      description: 'Next-generation web graphics and hardware-accelerated compute API.',
    },
    {
      title: 'SmolLM2: Lightweight Language Models',
      author: 'HuggingFaceTB Team',
      url: 'https://huggingface.co/blog/smollm2',
      description: 'State-of-the-art 135M, 360M, and 1.7B parameter small language models.',
    },
    {
      title: 'LoRA: Low-Rank Adaptation of Large Language Models',
      author: 'Hu et al., 2021 (arXiv:2106.09685)',
      url: 'https://arxiv.org/abs/2106.09685',
      description: 'Decomposes weight updates into low-rank matrices for parameter-efficient tuning.',
    },
    {
      title: 'QLoRA: Efficient Fine-Tuning of Quantized LLMs',
      author: 'Dettmers et al., 2023 (arXiv:2305.14314)',
      url: 'https://arxiv.org/abs/2305.14314',
      description: 'Combines 4-bit NormalFloat quantization with page optimizers and LoRA adapters.',
    },
    {
      title: 'Parameter-Efficient Transfer Learning for NLP (Adapters)',
      author: 'Houlsby et al., 2019 (arXiv:1902.00751)',
      url: 'https://arxiv.org/abs/1902.00751',
      description: 'Inserts bottleneck feed-forward adapter modules between transformer layers.',
    },
    {
      title: 'Prefix-Tuning: Optimizing Continuous Prompts for Generation',
      author: 'Li & Liang, 2021 (arXiv:2101.00190)',
      url: 'https://arxiv.org/abs/2101.00190',
      description: 'Prepends continuous trainable prefix vectors to key-value attention modules.',
    },
    {
      title: 'BitFit: Simple Parameter-Efficient Fine-Tuning for Transformer Models',
      author: 'Zaken et al., 2021 (arXiv:2106.10199)',
      url: 'https://arxiv.org/abs/2106.10199',
      description: 'Freezes model weight matrices W and updates only bias vectors b.',
    },
  ];

  return (
    <section className="w-full">
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 bg-slate-950/80 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
            <BookMarked className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Academic &amp; Technical References
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {citations.map((c, idx) => (
            <a
              key={idx}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all group block"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-bold text-xs text-slate-200 group-hover:text-blue-300 transition-colors line-clamp-1">
                  {c.title}
                </h3>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
              </div>
              <div className="text-[10px] font-mono text-blue-400 mb-2">{c.author}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{c.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
