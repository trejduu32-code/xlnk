import { useState, useCallback, useRef, useEffect } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "ai-chat-conversations";

function loadConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data).map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveConversations(convos: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maxTokens, setMaxTokens] = useState(-1);
  const [temperature, setTemperature] = useState(7);
  const [topP, setTopP] = useState(0.9);
  const abortRef = useRef(false);

  const activeConvo = conversations.find(c => c.id === activeConvoId) || null;
  const messages = activeConvo?.messages || [];

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const createNewChat = useCallback(() => {
    setActiveConvoId(null);
    setIsLoading(false);
    abortRef.current = true;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConvoId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvoId === id) {
      setActiveConvoId(null);
    }
  }, [activeConvoId]);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, title } : c)
    );
  }, []);

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
      timestamp: new Date(),
    };

    let convoId = activeConvoId;

    if (!convoId) {
      convoId = crypto.randomUUID();
      const title = content.trim().slice(0, 50) + (content.trim().length > 50 ? "..." : "");
      const newConvo: Conversation = {
        id: convoId,
        title,
        messages: [userMsg, assistantMsg],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations(prev => [newConvo, ...prev]);
      setActiveConvoId(convoId);
    } else {
      setConversations(prev =>
        prev.map(c =>
          c.id === convoId
            ? { ...c, messages: [...c.messages, userMsg, assistantMsg], updatedAt: new Date() }
            : c
        )
      );
    }

    setIsLoading(true);
    abortRef.current = false;

    try {
      const { Client } = await import("@gradio/client");
      const client = await Client.connect("MiniMaxAI/MiniMax-VL-01");
      
      const job = client.submit("/chat", {
        message: { text: content.trim(), files: [] },
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
      });

      let fullText = "";

      for await (const event of job) {
        if (abortRef.current) {
          job.cancel();
          break;
        }
        if (event.type === "data") {
          const chunk = String(event.data?.[0] ?? "");
          if (chunk) {
            fullText = chunk;
            const currentText = fullText;
            setConversations(prev =>
              prev.map(c =>
                c.id === convoId
                  ? {
                      ...c,
                      messages: c.messages.map(m =>
                        m.id === assistantMsg.id ? { ...m, content: currentText } : m
                      ),
                    }
                  : c
              )
            );
          }
        }
      }
    } catch (error: any) {
      if (abortRef.current) return;
      const errorText = `Error: ${error?.message || "Something went wrong."}`;
      setConversations(prev =>
        prev.map(c =>
          c.id === convoId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsg.id ? { ...m, content: errorText } : m
                ),
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, activeConvoId, maxTokens, temperature, topP]);

  const stopGenerating = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
  }, []);

  return {
    conversations,
    activeConvoId,
    messages,
    isLoading,
    maxTokens,
    setMaxTokens,
    temperature,
    setTemperature,
    topP,
    setTopP,
    sendMessage,
    stopGenerating,
    createNewChat,
    selectConversation,
    deleteConversation,
    renameConversation,
  };
}
