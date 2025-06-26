
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { ContentItem } from '@/types/contentEditor';

interface AdvancedContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: NodeContent, elementName?: string) => void;
  isReadOnly?: boolean;
}

export const AdvancedContentEditor = ({ 
  node, 
  isOpen, 
  onClose, 
  onSave, 
  isReadOnly = false 
}: AdvancedContentEditorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [elementName, setElementName] = useState(node.data.label);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (node.data.content) {
      setTitle(node.data.content.title || '');
      setDescription(node.data.content.description || '');
      
      // Convert existing items to new format if needed
      const items = node.data.content.items || [];
      const formattedItems = items.map((item: any, index: number) => ({
        id: item.id || `item-${index}`,
        type: 'paragraph' as const,
        content: item.content || '',
        style: {}
      }));
      setContentItems(formattedItems);
    }
    setElementName(node.data.label);
  }, [node, isOpen]);

  const handleSave = () => {
    if (!onSave) return;

    // Convert content items back to the expected format
    const items = contentItems.map(item => ({
      id: item.id,
      content: item.content
    }));

    const content: NodeContent = {
      title: title.trim(),
      description: description.trim(),
      items
    };

    onSave(content, elementName.trim());
    onClose();
  };

  const addContentItem = () => {
    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      type: 'paragraph',
      content: '',
      style: {}
    };
    setContentItems([...contentItems, newItem]);
  };

  const updateContentItem = (id: string, content: string) => {
    setContentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, content } : item
      )
    );
  };

  const removeContentItem = (id: string) => {
    setContentItems(items => items.filter(item => item.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh]' : 'w-[90vw] max-w-4xl h-[85vh]'} p-0 overflow-hidden`}>
        <DialogHeader className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-sm md:text-base font-medium truncate">
            {isReadOnly ? 'Visualizar Conteúdo' : 'Editar Conteúdo'} - {node.data.label}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-4">
            {!isReadOnly && (
              <div>
                <Label htmlFor="element-name" className="text-xs md:text-sm font-medium">
                  Nome do Elemento
                </Label>
                <Input
                  id="element-name"
                  value={elementName}
                  onChange={(e) => setElementName(e.target.value)}
                  className="mt-1 text-xs md:text-sm"
                  placeholder="Digite o nome do elemento"
                />
              </div>
            )}

            <div>
              <Label htmlFor="title" className="text-xs md:text-sm font-medium">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 text-xs md:text-sm"
                placeholder="Digite o título"
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-xs md:text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 text-xs md:text-sm min-h-[80px] resize-y"
                placeholder="Digite uma descrição"
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs md:text-sm font-medium">
                  Conteúdo Adicional
                </Label>
                {!isReadOnly && (
                  <Button
                    onClick={addContentItem}
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                )}
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {contentItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-start space-x-2">
                      <div className="flex-1">
                        <Textarea
                          value={item.content}
                          onChange={(e) => updateContentItem(item.id, e.target.value)}
                          className="text-xs md:text-sm min-h-[120px] resize-y"
                          placeholder={`Conteúdo ${index + 1}`}
                          readOnly={isReadOnly}
                        />
                      </div>
                      {!isReadOnly && (
                        <Button
                          onClick={() => removeContentItem(item.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 flex-shrink-0 p-1 h-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {contentItems.length === 0 && (
                  <div className="text-center text-gray-400 text-xs py-4">
                    Nenhum conteúdo adicional
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2 flex-shrink-0">
          <Button variant="outline" onClick={onClose} size="sm" className="text-xs">
            <X className="w-3 h-3 mr-1" />
            {isReadOnly ? 'Fechar' : 'Cancelar'}
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSave} size="sm" className="text-xs">
              <Save className="w-3 h-3 mr-1" />
              Salvar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
