
import { ContentItem } from '@/types/contentEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StyleButtons } from './StyleButtons';
import { ListItemEditor } from './ListItemEditor';
import { Trash2, Plus } from 'lucide-react';

interface ContentItemCardProps {
  item: ContentItem;
  onUpdate: (updates: Partial<ContentItem>) => void;
  onRemove: () => void;
  onAddListItem: () => void;
  onUpdateListItem: (listItemId: string, text: string) => void;
  onToggleChecklist: (listItemId: string) => void;
  onRemoveListItem?: (listItemId: string) => void;
}

export const ContentItemCard = ({
  item,
  onUpdate,
  onRemove,
  onAddListItem,
  onUpdateListItem,
  onToggleChecklist,
  onRemoveListItem,
}: ContentItemCardProps) => {
  const getTypeLabel = (type: ContentItem['type']) => {
    const labels = {
      h1: 'Título Principal',
      h2: 'Subtítulo',
      subtitle: 'Legendas',
      paragraph: 'Parágrafo',
      list: 'Lista',
      checklist: 'Lista de Verificação',
      link: 'Link'
    };
    return labels[type];
  };

  const renderContent = () => {
    switch (item.type) {
      case 'h1':
      case 'h2':
      case 'subtitle':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                {getTypeLabel(item.type)}
              </span>
              <div className="flex items-center space-x-2">
                <StyleButtons
                  style={item.style || {}}
                  onStyleChange={(style) => onUpdate({ style })}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Input
              value={item.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder={`Digite o ${getTypeLabel(item.type).toLowerCase()}...`}
              className="w-full"
            />
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                {getTypeLabel(item.type)}
              </span>
              <div className="flex items-center space-x-2">
                <StyleButtons
                  style={item.style || {}}
                  onStyleChange={(style) => onUpdate({ style })}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Textarea
              value={item.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Digite o parágrafo..."
              rows={3}
              className="w-full"
            />
          </div>
        );

      case 'list':
      case 'checklist':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                {getTypeLabel(item.type)}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddListItem}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Item
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1 pl-4">
              {item.items?.map((listItem) => (
                <ListItemEditor
                  key={listItem.id}
                  item={listItem}
                  isChecklist={item.type === 'checklist'}
                  onUpdate={(text) => onUpdateListItem(listItem.id, text)}
                  onToggle={() => onToggleChecklist(listItem.id)}
                  onRemove={onRemoveListItem ? () => onRemoveListItem(listItem.id) : undefined}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-2 border-b border-gray-200 last:border-b-0">
      {renderContent()}
    </div>
  );
};
