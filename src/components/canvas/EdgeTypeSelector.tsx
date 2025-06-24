
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EdgeType } from '@/types/canvas';
import { Minus, Workflow, Zap } from 'lucide-react';

interface EdgeTypeSelectorProps {
  currentType: EdgeType;
  onTypeChange: (type: EdgeType) => void;
}

export const EdgeTypeSelector = ({ currentType, onTypeChange }: EdgeTypeSelectorProps) => {
  const edgeTypes: { type: EdgeType; name: string; icon: React.ReactNode; description: string }[] = [
    { 
      type: 'straight', 
      name: 'Reto', 
      icon: <Minus className="w-4 h-4" />, 
      description: 'Linha reta' 
    },
    { 
      type: 'smoothstep', 
      name: 'Curvado', 
      icon: <Workflow className="w-4 h-4" />, 
      description: 'Linha curva suave' 
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs opacity-40 hover:opacity-70 transition-opacity">
          <Zap className="w-3 h-3 mr-1" />
          Linha
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" side="top">
        <div className="space-y-1">
          <h4 className="font-medium text-xs mb-2 text-gray-600">Tipo de Linha</h4>
          {edgeTypes.map((edgeType) => (
            <button
              key={edgeType.type}
              onClick={() => onTypeChange(edgeType.type)}
              className={`w-full p-2 text-left rounded-md border transition-colors hover:bg-gray-50 ${
                currentType === edgeType.type 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 opacity-60">
                  {edgeType.icon}
                </div>
                <div>
                  <div className="font-medium text-xs">{edgeType.name}</div>
                  <div className="text-xs text-gray-500">{edgeType.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
