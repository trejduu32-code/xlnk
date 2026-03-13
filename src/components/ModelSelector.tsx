import { MODELS, MODEL_PROVIDERS } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
        {MODEL_PROVIDERS.map(provider => {
          const providerModels = MODELS.filter(m => m.provider === provider.id);
          if (providerModels.length === 0) return null;
          return (
            <SelectGroup key={provider.id}>
              <SelectLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2">
                {provider.name}
              </SelectLabel>
              {providerModels.map(model => (
                <SelectItem key={model.id} value={model.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span>{model.name}</span>
                    <span className="text-[10px] text-muted-foreground">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
