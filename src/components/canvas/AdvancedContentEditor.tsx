
import { useState, useEffect } from 'react';
import { Node, useReactFlow } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { Save, X, Activity } from 'lucide-react';
import { ContentItem } from '@/types/contentEditor';
import { ContentItemButtons } from '@/components/content-editor/ContentItemButtons';
import { ContentItemCard } from '@/components/content-editor/ContentItemCard';
import { MetricsManager } from './MetricsManager';

interface AdvancedContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: NodeContent, elementName?: string) => void;
  isReadOnly?: boolean;
  funnelId?: string;
}

export const AdvancedContentEditor = ({ 
  node, 
  isOpen, 
  onClose, 
  onSave, 
  isReadOnly = false,
  funnelId 
}: AdvancedContentEditorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metrics, setMetrics] = useState('');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [elementName, setElementName] = useState(node.data.label);
  const [showMetricsManager, setShowMetricsManager] = useState(false);
  const isMobile = useIsMobile();
  const { getNodes } = useReactFlow();

  useEffect(() => {
    if (node.data.content) {
      setTitle(node.data.content.title || '');
      setDescription(node.data.content.description || '');
      setMetrics(node.data.content.metrics || '');
      
      // Convert existing items to new format if needed
      const items = node.data.content.items || [];
      const formattedItems = items.map((item: any, index: number) => {
        // Check if item is already in new format
        if (item.type && item.id) {
          return item;
        }
        // Convert old format to new format
        return {
          id: item.id || `item-${index}`,
          type: 'paragraph' as const,
          content: item.content || '',
          style: {}
        };
      });
      setContentItems(formattedItems);
    }
    setElementName(node.data.label);
  }, [node, isOpen]);

  const handleSave = () => {
    if (!onSave) return;

    const content: NodeContent = {
      title: title.trim(),
      description: description.trim(),
      metrics: metrics.trim(),
      items: contentItems
    };

    onSave(content, elementName.trim());
    onClose();
  };

  // Prevenir fechamento do dialog ao clicar dentro do conteúdo
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const addContentItem = (type: ContentItem['type']) => {
    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      type,
      content: '',
      style: {}
    };

    if (type === 'list' || type === 'checklist') {
      newItem.items = [];
    }

    setContentItems([...contentItems, newItem]);
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(items => 
      items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeContentItem = (id: string) => {
    setContentItems(items => items.filter(item => item.id !== id));
  };

  const addListItem = (itemId: string) => {
    setContentItems(items =>
      items.map(item => {
        if (item.id === itemId && (item.type === 'list' || item.type === 'checklist')) {
          return {
            ...item,
            items: [
              ...(item.items || []),
              { 
                id: Date.now().toString(), 
                text: '', 
                checked: item.type === 'checklist' ? false : undefined 
              }
            ]
          };
        }
        return item;
      })
    );
  };

  const updateListItem = (itemId: string, listItemId: string, text: string) => {
    setContentItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            items: item.items?.map(listItem => 
              listItem.id === listItemId ? { ...listItem, text } : listItem
            )
          };
        }
        return item;
      })
    );
  };

  const toggleChecklistItem = (itemId: string, listItemId: string) => {
    setContentItems(items =>
      items.map(item => {
        if (item.id === itemId && item.type === 'checklist') {
          return {
            ...item,
            items: item.items?.map(listItem => 
              listItem.id === listItemId ? { ...listItem, checked: !listItem.checked } : listItem
            )
          };
        }
        return item;
      })
    );
  };

  const removeListItem = (itemId: string, listItemId: string) => {
    setContentItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            items: item.items?.filter(listItem => listItem.id !== listItemId)
          };
        }
        return item;
      })
    );
  };

  // Filtrar apenas nós que têm o tipo CustomNodeData
  const allNodes = getNodes();
  const typedNodes = allNodes.filter((node): node is Node<CustomNodeData> => {
    return node.data && typeof node.data === 'object' && 'label' in node.data;
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className={`${isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh]' : 'w-[90vw] max-w-4xl h-[85vh]'} p-0 overflow-hidden`}
          onClick={handleContentClick}
        >
          <DialogHeader className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <DialogTitle className="text-sm md:text-base font-medium truncate flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span>{isReadOnly ? 'Visualizar Conteúdo' : 'Editar Conteúdo'} - {node.data.label}</span>
                {!isReadOnly && funnelId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMetricsManager(true)}
                  >
                    <Activity className="w-4 h-4 mr-1" />
                    Métricas
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3" onClick={handleContentClick}>
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
                    onClick={handleContentClick}
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
                  onClick={handleContentClick}
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
                  onClick={handleContentClick}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs md:text-sm font-medium">
                    Conteúdo Adicional
                  </Label>
                  {!isReadOnly && (
                    <ContentItemButtons onAddItem={addContentItem} />
                  )}
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {contentItems.map((item) => (
                    <ContentItemCard
                      key={item.id}
                      item={item}
                      onUpdate={(updates) => updateContentItem(item.id, updates)}
                      onRemove={() => removeContentItem(item.id)}
                      onAddListItem={() => addListItem(item.id)}
                      onUpdateListItem={(listItemId, text) => updateListItem(item.id, listItemId, text)}
                      onToggleChecklist={(listItemId) => toggleChecklistItem(item.id, listItemId)}
                      onRemoveListItem={(listItemId) => removeListItem(item.id, listItemId)}
                    />
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

      {/* Metrics Manager */}
      {funnelId && (
        <MetricsManager
          isOpen={showMetricsManager}
          onClose={() => setShowMetricsManager(false)}
          node={node}
          funnelId={funnelId}
          allNodes={typedNodes}
        />
      )}
    </>
  );
};
