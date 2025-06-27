
import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomNodeProps extends NodeProps {
  data: CustomNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
  isReadOnly?: boolean;
  isConnectable: boolean; // Made required to match NodeProps
}

export const CustomNode = ({ data, isConnectable, onUpdateNode, isReadOnly }: CustomNodeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nodeName, setNodeName] = useState(data.label || '');
  const [nodeContent, setNodeContent] = useState(
    typeof data.content === 'string' ? data.content : 
    data.content?.description || ''
  );
  const [showHandle, setShowHandle] = useState(Boolean(data.showHandle));
  const [elementName, setElementName] = useState(String(data.elementName || 'Botão'));
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Update local state when data changes from outside
    setNodeName(data.label || '');
    setNodeContent(
      typeof data.content === 'string' ? data.content : 
      data.content?.description || ''
    );
    setShowHandle(Boolean(data.showHandle));
    setElementName(String(data.elementName || 'Botão'));
  }, [data]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodeContent(event.target.value);
  };

  const handleElementNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setElementName(event.target.value);
  };

  const handleShowHandleChange = (checked: boolean) => {
    setShowHandle(checked);
  };

  const handleSave = () => {
    if (!nodeName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, digite um nome para o nó.",
        variant: "destructive",
      });
      return;
    }

    if (onUpdateNode) {
      onUpdateNode(String(data.id), { 
        label: nodeName, 
        content: nodeContent, 
        showHandle: showHandle,
        elementName: elementName
      });
    }
    setIsDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Reset local state to the last known good values
    setNodeName(data.label || '');
    setNodeContent(
      typeof data.content === 'string' ? data.content : 
      data.content?.description || ''
    );
    setShowHandle(Boolean(data.showHandle));
    setElementName(String(data.elementName || 'Botão'));
  };

  const renderContent = () => {
    if (typeof data.content === 'string' && data.content) {
      return (
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {data.content}
        </p>
      );
    }
    
    if (data.content && typeof data.content === 'object' && data.content.description) {
      return (
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {data.content.description}
        </p>
      );
    }
    
    return null;
  };

  return (
    <>
      <div className={`custom-node ${data.nodeType || ''}`}>
        <div className="node-header">
          <div className="node-name">
            {data.icon && <span className="mr-1">{String(data.icon)}</span>}
            {data.label}
          </div>
          {!isReadOnly && (
            <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M5.43 3.914A2 2 0 017.914 3.914l7.172 7.172a4 4 0 00-5.656 5.656L5.43 7.914a2 2 0 010-2.828z" />
              </svg>
            </Button>
          )}
        </div>

        <div className="node-content">
          {renderContent()}
        </div>
        
        {/* Link display - sempre exibir se houver link */}
        {data.link && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <span className="text-blue-600 font-medium">Link:</span>
            <br />
            <span className="text-blue-800 break-all">{String(data.link)}</span>
          </div>
        )}
      </div>

      {showHandle && (
        <>
          <Handle
            type="source"
            position={Position.Top}
            id="a"
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="b"
            isConnectable={isConnectable}
          />
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Elemento</DialogTitle>
            <DialogDescription>
              Altere o nome e conteúdo do elemento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" value={nodeName} onChange={handleNameChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="elementName" className="text-right">
                Tipo
              </Label>
              <Input id="elementName" value={elementName} onChange={handleElementNameChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right mt-2">
                Conteúdo
              </Label>
              <Textarea id="content" value={nodeContent} onChange={handleContentChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="showHandle" className="text-right">
                Mostrar Conexões
              </Label>
              <Checkbox id="showHandle" checked={showHandle} onCheckedChange={handleShowHandleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleDialogClose}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
