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
      <SelectTrigger className="w-[220px] h-9 text-sm bg-card border-border">
        <SelectValue>
          {selectedModel?.name || "Select model"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {MODEL_PROVIDERS.map(provider => {
          const providerModels = MODELS.filter(m => m.provider === provider.id);
          if (providerModels.length === 0) return null;
          return (
            <SelectGroup key={provider.id}>
              <SelectLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {provider.name}
              </SelectLabel>
              {providerModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
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
