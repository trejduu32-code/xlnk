import { Settings, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface ChatSettingsProps {
  maxTokens: number;
  setMaxTokens: (v: number) => void;
  temperature: number;
  setTemperature: (v: number) => void;
  topP: number;
  setTopP: (v: number) => void;
}

export function ChatSettings({
  maxTokens, setMaxTokens,
  temperature, setTemperature,
  topP, setTopP,
}: ChatSettingsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
      >
        <Settings className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-4 top-14 z-50 w-72 bg-card border border-border rounded-xl shadow-lg p-4 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Settings</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Max Tokens</span>
              <span className="text-foreground font-medium">{maxTokens === -1 ? "Unlimited" : maxTokens}</span>
            </div>
            <Slider
              value={[maxTokens]}
              onValueChange={([v]) => setMaxTokens(v)}
              min={-1}
              max={12800}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Temperature</span>
              <span className="text-foreground font-medium">{temperature}</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Top-p</span>
              <span className="text-foreground font-medium">{topP}</span>
            </div>
            <Slider
              value={[topP]}
              onValueChange={([v]) => setTopP(v)}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
        </div>
      )}
    </>
  );
}
