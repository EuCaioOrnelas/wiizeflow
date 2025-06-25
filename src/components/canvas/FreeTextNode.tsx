
import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Check, X } from 'lucide-react';

interface FreeTextNodeProps extends NodeProps {
  data: CustomNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
}

export const FreeTextNode = memo(({ id, data, selected, onUpdateNode }: FreeTextNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Clique para editar texto...');
  const [originalText, setOriginalText] = useState(data.label || 'Clique para editar texto...');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Atualizar estado local quando data.label mudar externamente
  useEffect(() => {
    if (!isEditing && data.label !== text) {
      setText(data.label || 'Clique para editar texto...');
      setOriginalText(data.label || 'Clique para editar texto...');
    }
  }, [data.label, isEditing, text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOriginalText(data.label || 'Clique para editar texto...');
    setText(data.label || 'Clique para editar texto...');
    setIsEditing(true);
  };

  const handleSave = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (onUpdateNode && text.trim() && text.trim() !== originalText) {
      onUpdateNode(id, { label: text.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setText(originalText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleTextareaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value.slice(0, 500));
  };

  const selectedClass = selected ? 'ring-2 ring-blue-500 ring-opacity-50' : '';

  return (
    <div className={`relative ${selectedClass}`}>
      {/* Handles nas 4 direções */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ top: -3 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ top: -3 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ left: -3 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ left: -3 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ right: -3 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ right: -3 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ bottom: -3 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ bottom: -3 }}
      />

      <div className="relative group">
        {isEditing ? (
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onClick={handleTextareaClick}
              maxLength={500}
              className="min-w-[200px] min-h-[60px] max-w-[400px] resize-none border-2 border-blue-500 bg-white text-gray-800 text-sm p-2 rounded focus:outline-none focus:ring-0"
              placeholder="Digite seu texto aqui..."
            />
            <div className="absolute bottom-1 right-1 text-xs text-gray-400">
              {text.length}/500
            </div>
            <div className="flex gap-1 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={handleSave}
              >
                <Check className="w-3 h-3 mr-1" />
                Salvar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={handleCancel}
              >
                <X className="w-3 h-3 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div 
              className="min-w-[200px] min-h-[60px] max-w-[400px] text-gray-800 text-sm p-2 whitespace-pre-wrap break-words cursor-text hover:bg-gray-50 rounded transition-colors"
              onClick={handleEditClick}
            >
              {text}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-100 shadow-sm"
              onClick={handleEditClick}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

FreeTextNode.displayName = 'FreeTextNode';
