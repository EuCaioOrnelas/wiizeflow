
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X, Eye, Edit3 } from "lucide-react";
import { Node } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';
import { ListItemEditor } from '@/components/content-editor/ListItemEditor';
import { ContentItemCard } from '@/components/content-editor/ContentItemCard';

interface ContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: NodeContent, elementName?: string) => void;
  readOnly?: boolean;
}

export const ContentEditor = ({ 
  node, 
  isOpen, 
  onClose, 
  onSave,
  readOnly = false
}: ContentEditorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [elementName, setElementName] = useState('');
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (node?.data?.content) {
      setTitle(node.data.content.title || '');
      setDescription(node.data.content.description || '');
      setItems(node.data.content.items || []);
    } else {
      setTitle('');
      setDescription('');
      setItems([]);
    }
    setElementName(node?.data?.label || '');
  }, [node]);

  const handleSave = () => {
    if (readOnly) return;
    
    const content: NodeContent = {
      title: title.trim(),
      description: description.trim(),
      items: items
    };

    onSave(content, elementName.trim() || node.data.label);
    onClose();
  };

  const handleAddItem = () => {
    if (readOnly) return;
    setEditingItem(null);
    setShowItemEditor(true);
  };

  const handleEditItem = (index: number) => {
    if (readOnly) return;
    setEditingItem({ ...items[index], index });
    setShowItemEditor(true);
  };

  const handleSaveItem = (item: any) => {
    if (readOnly) return;
    
    if (editingItem && editingItem.index !== undefined) {
      const updatedItems = [...items];
      updatedItems[editingItem.index] = item;
      setItems(updatedItems);
    } else {
      setItems([...items, item]);
    }
    setShowItemEditor(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (index: number) => {
    if (readOnly) return;
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {readOnly ? (
                <>
                  <Eye className="w-5 h-5" />
                  Visualizar Conteúdo
                </>
              ) : (
                <>
                  <Edit3 className="w-5 h-5" />
                  Editar Conteúdo
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {readOnly 
                ? `Visualizando o conteúdo de "${node.data.label}"`
                : `Configure o conteúdo para o elemento "${node.data.label}"`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Nome do Elemento */}
            <div className="space-y-2">
              <Label htmlFor="element-name">Nome do Elemento</Label>
              <Input
                id="element-name"
                value={elementName}
                onChange={(e) => setElementName(e.target.value)}
                placeholder="Digite o nome do elemento"
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título"
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição"
                rows={4}
                readOnly={readOnly}
                className={readOnly ? "bg-gray-50" : ""}
              />
            </div>

            {/* Lista de Itens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Itens de Conteúdo</Label>
                {!readOnly && (
                  <Button
                    onClick={handleAddItem}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                )}
              </div>

              {items.length > 0 ? (
                <div className="grid gap-3">
                  {items.map((item, index) => (
                    <ContentItemCard
                      key={index}
                      item={item}
                      index={index}
                      onEdit={readOnly ? undefined : () => handleEditItem(index)}
                      onDelete={readOnly ? undefined : () => handleDeleteItem(index)}
                      readOnly={readOnly}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {readOnly 
                    ? "Nenhum item de conteúdo adicionado"
                    : "Nenhum item adicionado. Clique em 'Adicionar Item' para começar."
                  }
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                {readOnly ? "Fechar" : "Cancelar"}
              </Button>
              {!readOnly && (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Editor de Item */}
      {showItemEditor && !readOnly && (
        <ListItemEditor
          isOpen={showItemEditor}
          onClose={() => {
            setShowItemEditor(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          initialData={editingItem}
        />
      )}
    </>
  );
};
