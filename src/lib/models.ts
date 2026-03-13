export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
}

export const MODEL_PROVIDERS = [
  { id: "claude", name: "Claude", color: "213 94% 48%" },
  { id: "mistral", name: "Mistral", color: "25 95% 53%" },
  { id: "kimi", name: "Kimi", color: "160 84% 39%" },
  { id: "mercury", name: "Mercury", color: "280 67% 55%" },
] as const;

export const MODELS: ModelInfo[] = [
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "claude", description: "Fast & capable" },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", provider: "claude", description: "Fastest Claude" },
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", provider: "claude", description: "Most powerful" },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", provider: "claude", description: "Balanced" },
  { id: "mistralai/mistral-large-2512", name: "Mistral Large 3", provider: "mistral", description: "Best Mistral" },
  { id: "mistralai/codestral-2508", name: "Codestral", provider: "mistral", description: "Code specialist" },
  { id: "mistralai/mistral-small-3.1-24b-instruct", name: "Mistral Small 3.1", provider: "mistral", description: "Fast & light" },
  { id: "mistralai/mistral-small-creative", name: "Mistral Creative", provider: "mistral", description: "Creative writing" },
  { id: "moonshotai/kimi-k2.5", name: "Kimi K2.5", provider: "kimi", description: "Multilingual" },
  { id: "moonshotai/kimi-k2-thinking", name: "Kimi K2 Thinking", provider: "kimi", description: "Deep reasoning" },
  { id: "inception/mercury-2", name: "Mercury 2", provider: "mercury", description: "Ultra fast" },
  { id: "inception/mercury-coder", name: "Mercury Coder", provider: "mercury", description: "Code generation" },
];

export const DEFAULT_MODEL = MODELS[0];
