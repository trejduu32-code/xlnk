export interface ModelInfo {
  id: string;
  name: string;
}

export const MODELS: ModelInfo[] = [
  { id: "gpt-oss:latest", name: "GPT-OSS" },
  { id: "qwen3-vl:8b", name: "Qwen3 VL 8B" },
  { id: "deepseek-r1:14b-qwen-distill-q8_0", name: "DeepSeek R1 14B" },
];

export const DEFAULT_MODEL = MODELS[0];
