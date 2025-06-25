
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, useStore } from '@xyflow/react';
import { Settings, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { EmojiGallery } from './EmojiGallery';
import { CustomNodeData } from '@/types/canvas';

interface CustomNodeProps {
  id: string;
  data: CustomNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
}

export const CustomNode = ({ id, data, onUpdateNode }: CustomNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEmojiGalleryOpen, setIsEmojiGalleryOpen] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const [tempIcon, setTempIcon] = useState(data.customIcon || '📝');
  const [tempColor, setTempColor] = useState(data.customColor || '#6B7280');
  const cardRef = useRef<HTMLDivElement>(null);
  
  const isConnecting = useStore((state) => !!state.connectionClickStartHandle);

  // Reset temp values when editing starts
  useEffect(() => {
    if (isEditing) {
      setTempLabel(data.label);
      setTempIcon(data.customIcon || '📝');
      setTempColor(data.customColor || '#6B7280');
    }
  }, [isEditing, data.label, data.customIcon, data.customColor]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing]);

  // Função para verificar se realmente há conteúdo interno
  const hasActualContent = () => {
    if (!data.content) return false;
    
    const content = data.content;
    const hasTitle = content.title && content.title.trim().length > 0;
    const hasDescription = content.description && content.description.trim().length > 0;
    const hasItems = content.items && content.items.length > 0 && 
      content.items.some(item => item.content && item.content.trim().length > 0);
    
    return hasTitle || hasDescription || hasItems;
  };

  const handleSave = useCallback(() => {
    if (onUpdateNode) {
      onUpdateNode(id, {
        label: tempLabel,
        customIcon: tempIcon,
        customColor: tempColor,
      });
    }
    setIsEditing(false);
    setIsEmojiGalleryOpen(false);
  }, [id, tempLabel, tempIcon, tempColor, onUpdateNode]);

  const handleCancel = useCallback(() => {
    setTempLabel(data.label);
    setTempIcon(data.customIcon || '📝');
    setTempColor(data.customColor || '#6B7280');
    setIsEditing(false);
    setIsEmojiGalleryOpen(false);
  }, [data.label, data.customIcon, data.customColor]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    setTempIcon(emoji);
    setIsEmojiGalleryOpen(false);
  }, []);

  const colorOptions = [
    '#6B7280', '#EF4444', '#F97316', '#EAB308', 
    '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'
  ];

  const getNodeStyle = () => ({
    backgroundColor: tempColor,
    borderColor: tempColor,
    color: ['#EAB308', '#22C55E', '#3B82F6'].includes(tempColor) ? '#fff' : '#fff'
  });

  return (
    <>
      <div 
        className="relative bg-white border-2 rounded-lg shadow-md min-w-[120px] p-3"
        style={{ borderColor: data.customColor || '#6B7280' }}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-gray-400"
          isConnectable={!isConnecting}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <span className="text-lg">{data.customIcon || '📝'}</span>
            <span className="text-sm font-medium text-gray-900 truncate">
              {data.label}
            </span>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-6 w-6 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>

        {hasActualContent() && (
          <div className="mt-2 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
            Conteúdo interno
          </div>
        )}

        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-gray-400"
          isConnectable={!isConnecting}
        />
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card ref={cardRef} className="w-96 max-h-[90vh] overflow-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Personalizar Elemento</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="p-1 h-6 w-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Elemento</label>
                  <Input
                    value={tempLabel}
                    onChange={(e) => setTempLabel(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nome do elemento"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ícone</label>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">{tempIcon}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEmojiGalleryOpen(true)}
                    >
                      Escolher Emoji
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cor</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTempColor(color)}
                        className={`w-8 h-8 rounded border-2 ${
                          tempColor === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preview</label>
                  <div 
                    className="flex items-center space-x-2 p-3 rounded-lg border-2"
                    style={getNodeStyle()}
                  >
                    <span className="text-lg">{tempIcon}</span>
                    <span className="text-sm font-medium">
                      {tempLabel || 'Nome do elemento'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <EmojiGallery
        isOpen={isEmojiGalleryOpen}
        onClose={() => setIsEmojiGalleryOpen(false)}
        onEmojiSelect={handleEmojiSelect}
        currentEmoji={tempIcon}
      />
    </>
  );
};
