import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessageBubble } from "@/components/ChatMessage";
import { ChatSettings } from "@/components/ChatSettings";
import { CompanionBall } from "@/components/CompanionBall";
import { Menu } from "lucide-react";

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
  const [ballIsRed, setBallIsRed] = useState(false);
  const ballTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleBallClick = useCallback(() => {
    setBallIsRed(true);
    if (ballTimerRef.current) clearTimeout(ballTimerRef.current);
    ballTimerRef.current = setTimeout(() => setBallIsRed(false), 3000);
  }, []);

  // Determine which message (if any) is currently streaming
  const streamingMsgId =
    isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1].id
      : null;

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
            <span className="text-sm font-semibold text-foreground">1mp Ai</span>
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
              <CompanionBall isGenerating={false} />
              <h2 className="text-lg font-semibold text-foreground mb-1 mt-4">1mp Ai</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask anything — powered by MiniMax VL.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map(msg => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={msg.id === streamingMsgId}
                  ballIsRed={ballIsRed}
                  onBallClick={handleBallClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Input area with idle ball */}
        <div className="max-w-3xl mx-auto w-full relative">
          {messages.length > 0 && !isLoading && (
            <div className="flex justify-center -mt-2 mb-1">
              <CompanionBall isGenerating={false} />
            </div>
          )}
          <ChatInput onSend={sendMessage} onStop={stopGenerating} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
