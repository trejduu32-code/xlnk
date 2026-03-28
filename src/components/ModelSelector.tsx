import { MODELS } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  const selectedModel = MODELS.find(m => m.id === value);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-auto h-8 text-xs font-medium bg-card border-border rounded-lg px-3 gap-1.5">
        <SelectValue>
          {selectedModel?.name || "Select model"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        {MODELS.map(model => (
          <SelectItem key={model.id} value={model.id} className="text-sm">
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
