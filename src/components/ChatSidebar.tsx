import { Conversation } from "@/hooks/useChat";
import { Plus, MessageSquare, Trash2, X, Sparkles } from "lucide-react";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConvoId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  conversations,
  activeConvoId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:relative z-50 h-full flex flex-col bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] sidebar-transition ${
          isOpen ? "w-[260px] opacity-100" : "w-0 opacity-0 overflow-hidden md:w-0"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 h-14 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-foreground" />
            <span className="text-sm font-semibold text-foreground">Chats</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 mb-2">
          <button
            onClick={() => { onNew(); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-[hsl(var(--sidebar-active))] hover:bg-accent rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto chat-scrollbar px-2 py-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-4">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-0.5">
              {conversations.map(convo => (
                <div
                  key={convo.id}
                  className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                    convo.id === activeConvoId
                      ? "bg-[hsl(var(--sidebar-active))] text-foreground"
                      : "text-[hsl(var(--sidebar-fg))] hover:bg-[hsl(var(--sidebar-hover))]"
                  }`}
                  onClick={() => onSelect(convo.id)}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />
                  <span className="truncate flex-1">{convo.title}</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(convo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
