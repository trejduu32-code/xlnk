import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessageBubble } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ModelSelector } from "@/components/ModelSelector";
import { Menu, Sparkles, Settings2 } from "lucide-react";

const Index = () => {
  const {
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
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConvoId={activeConvoId}
        onSelect={selectConversation}
        onNew={createNewChat}
        onDelete={deleteConversation}
        onRename={renameConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 h-12 flex-shrink-0 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">Xlnk AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg">
              <Settings2 className="w-4 h-4" />
            </button>
            <ModelSelector value={selectedModel} onChange={setSelectedModel} disabled={isLoading} />
          </div>
        </header>

        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-5">
                <Sparkles className="w-7 h-7 text-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to Xlnk AI</h2>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Your intelligent assistant powered by cutting-edge language models. Start a conversation below.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-6 px-4 space-y-5">
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
    </div>
  );
};

export default Index;
