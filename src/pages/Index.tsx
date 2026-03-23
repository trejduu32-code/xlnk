import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessageBubble } from "@/components/ChatMessage";
import { ChatSettings } from "@/components/ChatSettings";
import { Menu, Sparkles } from "lucide-react";

const Index = () => {
  const {
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
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 flex bg-background">
      <ChatSidebar
        conversations={conversations}
        activeConvoId={activeConvoId}
        onSelect={(id) => { selectConversation(id); setSidebarOpen(false); }}
        onNew={() => { createNewChat(); setSidebarOpen(false); }}
        onDelete={deleteConversation}
        onRename={renameConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">1mp Ai</span>
            </div>
          </div>
          <ChatSettings
            maxTokens={maxTokens}
            setMaxTokens={setMaxTokens}
            temperature={temperature}
            setTemperature={setTemperature}
            topP={topP}
            setTopP={setTopP}
          />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scrollbar px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-10 h-10 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-1">1mp Ai</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask anything — powered by MiniMax VL-01.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
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
