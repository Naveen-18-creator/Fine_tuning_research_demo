# Cost-Efficiency of Lightweight Fine-Tuning vs. Training from Scratch: A Case Study in Domain-Specific LLMs

An interactive research laboratory demonstration dashboard evaluating the cost-efficiency frontier of Parameter-Efficient Fine-Tuning (PEFT) versus Full Fine-Tuning and Pre-training from Scratch across small-footprint language models (135M to 1.7B parameters).

---

## 🎯 Research Objective

Can parameter-efficient fine-tuning (LoRA, QLoRA, Adapters, Prefix Tuning, BitFit) achieve comparable domain adaptation performance with a fraction of the computational cost, VRAM memory, training time, and financial expenditure?

This interactive web dashboard allows research panels, professors, and ML practitioners to:
1. **Execute Browser-Native Models:** Run open small-scale LLMs (135M to 1.7B) locally inside the browser via `@huggingface/transformers` using WebGPU or WASM acceleration.
2. **Visualize Transformer Adaptation:** Interactively inspect frozen vs. trainable parameter distributions across 7 fine-tuning paradigms.
3. **Calculate Parameter Ratios:** Compute exact trainable parameter percentages and frozen weight ratios across dynamic model scales.
4. **Analyze Pareto Frontiers:** Plot training cost (USD / GPU hours) against task accuracy score in the Cost-Performance Lab.
5. **Import Empirical Benchmarks:** Load real CSV or JSON experiment output logs to replace illustrative baseline curves with live research data.
6. **Deliver Academic Defense Presentations:** Utilize the built-in 11-slide presentation mode for college or conference research defenses.

---

## 🏛️ Architecture & Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (Glassmorphism Dark Theme)
- **Charts & Visuals:** Recharts, Lucide React Icons
- **Inference Engine:** `@huggingface/transformers` (Transformers.js v3)
- **Hardware Acceleration:** WebGPU (via WGSL shaders) with CPU WASM fallback
- **Data Import/Export:** PapaParse (CSV) & native JSON parser

---

## 🤖 Models Included

| Model Name | HuggingFace Repo ID | Param Count | Approx Size (q4) | Architecture | Target Engine |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SmolLM2 135M** | `HuggingFaceTB/SmolLM2-135M-Instruct` | 135M | ~90 MB | Llama-like | WebGPU / WASM |
| **SmolLM2 360M** | `HuggingFaceTB/SmolLM2-360M-Instruct` | 360M | ~240 MB | Llama-like | WebGPU / WASM |
| **Qwen2.5 0.5B** | `Qwen/Qwen2.5-0.5B-Instruct` | 490M | ~350 MB | Qwen2 | WebGPU / WASM |
| **TinyLlama 1.1B** | `TinyLlama/TinyLlama-1.1B-Chat-v0.1` | 1.1B | ~650 MB | Llama | WebGPU / WASM |
| **SmolLM2 1.7B** | `HuggingFaceTB/SmolLM2-1.7B-Instruct` | 1.7B | ~1.0 GB | Llama-like | WebGPU |

### Why These Models Were Selected:
These models represent state-of-the-art small language models capable of running directly in browser memory without requiring remote GPU API backends. They serve as an ideal testbed for domain-specific fine-tuning research on resource-constrained edge devices.

---

## 🧪 Fine-Tuning Methods Evaluated

1. **Full Fine-Tuning:** Updates 100% of pre-trained parameters across all layers.
2. **LoRA (Low-Rank Adaptation):** Freezes base model ($W_0$) and injects low-rank matrices ($W = W_0 + B \cdot A$).
3. **QLoRA:** Combines 4-bit NormalFloat (NF4) base model quantization with 16-bit LoRA adapters.
4. **Bottleneck Adapters:** Inserts small feed-forward residual layers after attention and MLP sublayers.
5. **Prefix Tuning:** Prepends continuous trainable prefix vectors to key-value attention matrices.
6. **Prompt Tuning:** Prepends virtual trainable soft prompt token embeddings to the input sequence.
7. **BitFit:** Freezes all matrix weights $W$ and trains only bias vectors $b$.

---

## ⚡ Live Measured Data vs. Illustrative / Simulated Data

To maintain scientific integrity, the website strictly demarcates data sources:

- **LIVE MEASURED DATA:** Local browser inference latency (ms), model load time (ms), tokens generated, tokens per second, and active execution device (WebGPU vs WASM) are measured empirically on your local machine hardware.
- **ILLUSTRATIVE / SIMULATED DATA:** The Cost-Performance scatter plot defaults to "MODE A: Illustrative Mode" with clear labels indicating conceptual values. Switch to "MODE B: Research Data" and import your own CSV/JSON training logs to plot real empirical data.

---

## 💻 How to Install and Run

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation
```bash
# Clone or navigate to the project directory
cd d:\DAA

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📊 How to Import Custom Experimental Results

1. Click **"Import Dataset"** in the Cost-Performance Lab or Results Dashboard.
2. Drag and drop your `.csv` or `.json` experiment log file.
3. Supported CSV columns:
   `method`, `model`, `trainable_params`, `total_params`, `training_time_hours`, `gpu_memory_gb`, `estimated_cost_usd`, `performance_score`, `f1_score`, `accuracy`, `perplexity`, `energy_kwh`
4. Click **"Apply Dataset to Lab"** to dynamically update charts and research metrics.

---

## 🖥️ How to Use Presentation Mode

Click **"Presentation Mode"** in the top navigation header or press the key shortcut to enter an 11-slide full-screen research defense presentation designed for college academic panels. Navigate using the on-screen buttons or Left/Right Arrow keys.

---

## 🔬 Research Limitations

1. **Browser Inference vs. Offline Training:** Browser execution runs inference on pre-trained/quantized ONNX weights. Actual fine-tuning gradient backpropagation should be performed using PyTorch/Accelerate/PEFT on dedicated GPU hardware.
2. **Context Window Limitations:** In-browser WebGPU/WASM memory limits generation context length compared to server-side CUDA clusters.
