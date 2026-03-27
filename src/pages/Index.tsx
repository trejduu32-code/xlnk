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
              <div className="mb-4">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAABx0lEQVR4AcyUu0oDQRSGja2IPoCNsREv4BMkpfaiKILxgpaxUNBHUNBCS8VLBFEU+1gmTyCYiI1JkwcQxHr9TrKzzF51s7OScL6czTlz/j8zyW5/3z++es/MsqwinMEDXMAOTMQ9lMidIZiFCqInsAnzsA5HUKP3CnewB8PUIiPUjOERJj8gB2ExSWMRDuCdmRlyaISaMXENcWKAxWUMV8iBEWhmD0TtKFDMLpaYr4CcjF3qJJ8Zi+QoSp121+/yRRtoZXUFlxlN+ZGf9AUJr6/0eZcZjWWQsycZiRwbKColr9m0ahjM8o9ty3nNnEa7a+ZtSMk4ZmxXnghpmH35zCjMQhrxpkSdnVEYhzSirER1s0FVNJhrmUymrvR0s09VNJhrupZu5mroixJcv+izjhnbPaVRBVPxjdAtOOGY2ZU1O5tIc2ygpQu5zGg2aMrDM+kOC2g9o+UKl5l0WNSEPNcF6CaqzN8EDfrM1CJ7QG50OXtV/kteDVsUaiYDGMpRjHG9D/cQ9Y+Vox9lpsm6wIg0kwmGW3AISzBFTZ6fu+RLeIRz2KaXB/nN+Rgcv5p5xxCswzFswAJsgdw23qW+z7HNfAoxCj8AAAD///yLMP8AAAAGSURBVAMAso19N8rYxxgAAAAASUVORK5CYII="
                  alt="1mp Ai"
                  className="w-16 h-16 ball-idle"
                  style={{ imageRendering: "pixelated" }}
                  draggable={false}
                />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">1mp Ai</h2>
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
          <ChatInput onSend={sendMessage} onStop={stopGenerating} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
