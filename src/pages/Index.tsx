import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessageBubble } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelector } from "@/components/ModelSelector";
import { Button } from "@/components/ui/button";
import { Bot, Trash2 } from "lucide-react";

const Index = () => {
  const { messages, isLoading, selectedModel, setSelectedModel, sendMessage, stopGenerating, clearMessages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-base font-semibold text-foreground">AI Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isLoading} />
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearMessages} className="text-muted-foreground hover:text-destructive h-9 w-9">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Start a conversation</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Choose a model and send a message to begin chatting with AI.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
            {messages.map(msg => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto w-full">
        <ChatInput onSend={sendMessage} onStop={stopGenerating} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
