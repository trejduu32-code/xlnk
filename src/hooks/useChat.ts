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
  const [selectedModel, setSelectedModel] = useState("gpt-oss:latest");
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
      const allMessages = activeConvo
        ? [...activeConvo.messages.filter(m => m.content).map(m => ({ role: m.role, content: m.content })), { role: "user" as const, content: content.trim() }]
        : [{ role: "user" as const, content: content.trim() }];

      const controller = new AbortController();
      const resp = await fetch("https://qwen-vl.ai.unturf.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer dummy-api-key" },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "system",
              content: "You are 1mpAi, an advanced AI assistant created by Riste Stev. You are helpful, knowledgeable, creative, and precise. You provide clear, well-structured answers. When writing code, you use best practices and include helpful comments. You are friendly yet professional, and always aim to give the most accurate and useful response possible. If you don't know something, you say so honestly rather than guessing. You can reason step-by-step through complex problems.",
            },
            ...allMessages,
          ],
          temperature: 0.8,
          max_tokens: -1,
          top_p: 0.9,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) throw new Error(`API error: ${resp.status}`);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";

      while (true) {
        if (abortRef.current) { controller.abort(); break; }
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              const captured = fullText;
              setConversations(prev =>
                prev.map(c =>
                  c.id === convoId
                    ? { ...c, messages: c.messages.map(m => m.id === assistantMsg.id ? { ...m, content: captured } : m) }
                    : c
                )
              );
            }
          } catch {}
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
  }, [messages, isLoading, activeConvoId, selectedModel]);

  const stopGenerating = useCallback(() => {
    abortRef.current = true;
    setIsLoading(false);
  }, []);

  return {
    conversations,
    activeConvoId,
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    stopGenerating,
    createNewChat,
    selectConversation,
    deleteConversation,
    renameConversation,
  };
}
