interface PuterAI {
  chat(
    message: string | Array<{ role: string; content: string }>,
    options?: { model?: string; stream?: boolean }
  ): Promise<any>;
}

interface Puter {
  ai: PuterAI;
}

declare const puter: Puter;
