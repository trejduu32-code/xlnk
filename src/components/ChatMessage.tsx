import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChatMessage as ChatMessageType } from "@/hooks/useChat";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  ballIsRed?: boolean;
  onBallClick?: () => void;
}

const BALL_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAABx0lEQVR4AcyUu0oDQRSGja2IPoCNsREv4BMkpfaiKILxgpaxUNBHUNBCS8VLBFEU+1gmTyCYiI1JkwcQxHr9TrKzzF51s7OScL6czTlz/j8zyW5/3z++es/MsqwinMEDXMAOTMQ9lMidIZiFCqInsAnzsA5HUKP3CnewB8PUIiPUjOERJj8gB2ExSWMRDuCdmRlyaISaMXENcWKAxWUMV8iBEWhmD0TtKFDMLpaYr4CcjF3qJJ8Zi+QoSp121+/yRRtoZXUFlxlN+ZGf9AUJr6/0eZcZjWWQsycZiRwbKColr9m0ahjM8o9ty3nNnEa7a+ZtSMk4ZmxXnghpmH35zCjMQhrxpkSdnVEYhzSirER1s0FVNJhrmUymrvR0s09VNJhrupZu5mroixJcv+izjhnbPaVRBVPxjdAtOOGY2ZU1O5tIc2ygpQu5zGg2aMrDM+kOC2g9o+UKl5l0WNSEPNcF6CaqzN8EDfrM1CJ7QG50OXtV/kteDVsUaiYDGMpRjHG9D/cQ9Y+Vox9lpsm6wIg0kwmGW3AISzBFTZ6fu+RLeIRz2KaXB/nN+Rgcv5p5xxCswzFswAJsgdw23qW+z7HNfAoxCj8AAAD///yLMP8AAAAGSURBVAMAso19N8rYxxgAAAAASUVORK5CYII=";

function CodeBlock({ className, children }: { className?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group my-3">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[hsl(0,0%,10%)] border border-border rounded-t-lg text-xs text-muted-foreground">
        <span>{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          fontSize: "0.8125rem",
          border: "1px solid hsl(0 0% 18%)",
          borderTop: "none",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function ChatMessageBubble({ message, isStreaming, ballIsRed, onBallClick }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-accent text-foreground" : "bg-accent text-foreground"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] min-w-0 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
              : "bg-chat-ai text-chat-ai-foreground rounded-tl-md"
          }`}
        >
          {message.content ? (
            isUser ? (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : (
              <div className="markdown-content break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const isInline = !className && typeof children === "string" && !children.includes("\n");
                      if (isInline) {
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                      return <CodeBlock className={className}>{String(children)}</CodeBlock>;
                    },
                    pre({ children }) {
                      return <>{children}</>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {isStreaming && (
                  <img
                    src={BALL_SRC}
                    alt="AI writing"
                    onClick={onBallClick}
                    className="inline-ball-stream"
                    style={{
                      filter: ballIsRed
                        ? "hue-rotate(-80deg) saturate(3) brightness(0.9)"
                        : "none",
                      transition: "filter 0.4s ease",
                    }}
                    draggable={false}
                  />
                )}
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex gap-1 py-1">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
