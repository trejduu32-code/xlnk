import { useState, useCallback, useRef } from "react";
import { DEFAULT_MODEL } from "@/lib/models";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL.id);
  const abortRef = useRef(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      model: selectedModel,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);
    abortRef.current = false;

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await puter.ai.chat(history, {
        model: selectedModel,
        stream: true,
      });

      let fullText = "";
      for await (const part of response) {
        if (abortRef.current) break;
        const text = part?.text || "";
        fullText += text;
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id ? { ...m, content: fullText } : m
          )
        );
      }
    } catch (error: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsg.id
            ? { ...m, content: `Error: ${error?.message || "Something went wrong. Please try again."}` }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedModel, isLoading]);

  const stopGenerating = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    abortRef.current = true;
  }, []);

  return {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    stopGenerating,
    clearMessages,
  };
}
