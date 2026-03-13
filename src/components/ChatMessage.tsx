import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage as ChatMessageType } from "@/hooks/useChat";
import { MODELS } from "@/lib/models";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const model = MODELS.find(m => m.id === message.model);

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-accent text-foreground" : "bg-accent text-foreground"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] min-w-0 ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && model && (
          <span className="text-[11px] text-muted-foreground mb-1 block">
            {model.name}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-[hsl(var(--chat-user))] text-[hsl(var(--chat-user-foreground))] rounded-tr-md"
              : "bg-[hsl(var(--chat-ai))] text-[hsl(var(--chat-ai-foreground))] rounded-tl-md"
          }`}
        >
          {message.content ? (
            isUser ? (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : (
              <div className="markdown-content break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )
          ) : (
            <span className="inline-flex gap-1 py-1">
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" style={{ animationDelay: "300ms" }} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
