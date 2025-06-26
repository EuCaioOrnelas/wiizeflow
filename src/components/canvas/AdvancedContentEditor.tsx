
import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Node } from '@xyflow/react';
import { 
  Save, 
  Bold, 
  Italic, 
  Underline, 
  Link,
  List,
  CheckSquare,
  Heading1,
  Heading2,
  Type,
  Highlighter,
  X
} from 'lucide-react';
import { CustomNodeData, NodeContent } from '@/types/canvas';

interface AdvancedContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: NodeContent, elementName?: string) => void;
  isReadOnly?: boolean;
}

interface ContentBlock {
  id: string;
  type: 'h1' | 'h2' | 'subtitle' | 'paragraph' | 'list' | 'checklist' | 'link';
  content: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    highlight?: boolean;
  };
  url?: string;
  items?: { id: string; text: string; checked?: boolean }[];
}

export const AdvancedContentEditor = ({ node, isOpen, onClose, onSave, isReadOnly = false }: AdvancedContentEditorProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [elementName, setElementName] = useState('');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node.data.content) {
      const content = node.data.content as NodeContent;
      setTitle(content.title || '');
      setBlocks(content.items || []);
    }
    setElementName(node.data.label || '');
  }, [node]);

  // Atalhos de teclado (apenas no modo de edição)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReadOnly) return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            toggleStyle('bold');
            break;
          case 'i':
            e.preventDefault();
            toggleStyle('italic');
            break;
          case 'u':
            e.preventDefault();
            toggleStyle('underline');
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    if (isOpen && !isReadOnly) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeBlock, isReadOnly]);

  const addBlock = useCallback((type: ContentBlock['type']) => {
    if (isReadOnly) return;
    
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      style: {},
    };

    if (type === 'list' || type === 'checklist') {
      newBlock.items = [];
    }

    setBlocks(prev => [...prev, newBlock]);
    setActiveBlock(newBlock.id);
  }, [isReadOnly]);

  const updateBlock = useCallback((id: string, updates: Partial<ContentBlock>) => {
    if (isReadOnly) return;
    
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  }, [isReadOnly]);

  const removeBlock = useCallback((id: string) => {
    if (isReadOnly) return;
    
    setBlocks(prev => prev.filter(block => block.id !== id));
    setActiveBlock(null);
  }, [isReadOnly]);

  const toggleStyle = useCallback((styleType: 'bold' | 'italic' | 'underline' | 'highlight') => {
    if (activeBlock && !isReadOnly) {
      updateBlock(activeBlock, {
        style: {
          ...blocks.find(b => b.id === activeBlock)?.style,
          [styleType]: !blocks.find(b => b.id === activeBlock)?.style?.[styleType]
        }
      });
    }
  }, [activeBlock, blocks, updateBlock, isReadOnly]);

  const addListItem = useCallback((blockId: string) => {
    if (isReadOnly) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (block && (block.type === 'list' || block.type === 'checklist')) {
      updateBlock(blockId, {
        items: [
          ...(block.items || []),
          { 
            id: Date.now().toString(), 
            text: '', 
            checked: block.type === 'checklist' ? false : undefined 
          }
        ]
      });
    }
  }, [blocks, updateBlock, isReadOnly]);

  const updateListItem = useCallback((blockId: string, itemId: string, text: string) => {
    if (isReadOnly) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      updateBlock(blockId, {
        items: block.items?.map(item => 
          item.id === itemId ? { ...item, text } : item
        )
      });
    }
  }, [blocks, updateBlock, isReadOnly]);

  const toggleChecklistItem = useCallback((blockId: string, itemId: string) => {
    if (isReadOnly) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'checklist') {
      updateBlock(blockId, {
        items: block.items?.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      });
    }
  }, [blocks, updateBlock, isReadOnly]);

  const handleSave = useCallback(() => {
    if (isReadOnly || !onSave) return;
    
    const content: NodeContent = {
      title,
      description: '', // Mantido para compatibilidade
      items: blocks,
    };
    
    onSave(content, elementName);
    toast({
      title: "Conteúdo salvo!",
      description: "As alterações foram salvas com sucesso.",
    });
    onClose();
  }, [title, blocks, elementName, onSave, onClose, toast, isReadOnly]);

  const getBlockStyle = (block: ContentBlock) => {
    const style: React.CSSProperties = {};
    if (block.style?.bold) style.fontWeight = 'bold';
    if (block.style?.italic) style.fontStyle = 'italic';
    if (block.style?.underline) style.textDecoration = 'underline';
    if (block.style?.highlight) style.backgroundColor = '#fef08a';
    return style;
  };

  const renderBlock = (block: ContentBlock) => {
    const commonProps = {
      style: getBlockStyle(block),
      onFocus: () => !isReadOnly && setActiveBlock(block.id),
      onBlur: () => setActiveBlock(null),
      readOnly: isReadOnly,
      disabled: isReadOnly,
    };

    switch (block.type) {
      case 'h1':
        return (
          <Input
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Título principal..."
            className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
            {...commonProps}
          />
        );
      
      case 'h2':
        return (
          <Input
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Subtítulo..."
            className="text-xl font-semibold border-none p-0 focus-visible:ring-0"
            {...commonProps}
          />
        );
      
      case 'subtitle':
        return (
          <Input
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Parágrafo de destaque..."
            className="text-lg font-medium border-none p-0 focus-visible:ring-0"
            {...commonProps}
          />
        );
      
      case 'paragraph':
        return (
          <Textarea
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Digite seu texto aqui..."
            className="border-none p-0 resize-none focus-visible:ring-0 min-h-[40px]"
            {...commonProps}
          />
        );
      
      case 'link':
        return (
          <div key={block.id} className="space-y-2">
            <Input
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Texto do link..."
              className="border-none p-0 focus-visible:ring-0"
              {...commonProps}
            />
            <Input
              value={block.url || ''}
              onChange={(e) => updateBlock(block.id, { url: e.target.value })}
              placeholder="URL do link..."
              className="text-sm text-blue-600 border-none p-0 focus-visible:ring-0"
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>
        );
      
      case 'list':
      case 'checklist':
        return (
          <div key={block.id} className="space-y-2">
            {block.items?.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                {block.type === 'checklist' && (
                  <input
                    type="checkbox"
                    checked={item.checked || false}
                    onChange={() => toggleChecklistItem(block.id, item.id)}
                    className="rounded"
                    disabled={isReadOnly}
                  />
                )}
                {block.type === 'list' && (
                  <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                )}
                <Input
                  value={item.text}
                  onChange={(e) => updateListItem(block.id, item.id, e.target.value)}
                  placeholder="Item da lista..."
                  className="border-none p-0 focus-visible:ring-0"
                  style={block.type === 'checklist' && item.checked ? { textDecoration: 'line-through', opacity: 0.6 } : {}}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
            ))}
            {!isReadOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addListItem(block.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                + Adicionar item
              </Button>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 m-4 [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>
              {isReadOnly ? 'Visualizar Conteúdo' : 'Editor de Conteúdo'} - {elementName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Element Name Section (apenas no modo de edição) */}
        {!isReadOnly && (
          <div className="px-6 py-2 border-b">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Nome do Elemento:</label>
              <Input
                value={elementName}
                onChange={(e) => setElementName(e.target.value)}
                placeholder="Nome do elemento"
                className="flex-1 max-w-xs"
              />
            </div>
          </div>
        )}

        {/* Toolbar (apenas no modo de edição) */}
        {!isReadOnly && (
          <div className="px-6 py-2 border-b flex items-center space-x-2 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => addBlock('h1')}>
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addBlock('h2')}>
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addBlock('subtitle')}>
              <Type className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addBlock('paragraph')}>
              Parágrafo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addBlock('list')}>
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addBlock('checklist')}>
              <CheckSquare className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addBlock('link')}>
              <Link className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button 
              variant={blocks.find(b => b.id === activeBlock)?.style?.bold ? "default" : "ghost"} 
              size="sm" 
              onClick={() => toggleStyle('bold')}
              disabled={!activeBlock}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button 
              variant={blocks.find(b => b.id === activeBlock)?.style?.italic ? "default" : "ghost"} 
              size="sm" 
              onClick={() => toggleStyle('italic')}
              disabled={!activeBlock}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button 
              variant={blocks.find(b => b.id === activeBlock)?.style?.underline ? "default" : "ghost"} 
              size="sm" 
              onClick={() => toggleStyle('underline')}
              disabled={!activeBlock}
            >
              <Underline className="w-4 h-4" />
            </Button>
            <Button 
              variant={blocks.find(b => b.id === activeBlock)?.style?.highlight ? "default" : "ghost"} 
              size="sm" 
              onClick={() => toggleStyle('highlight')}
              disabled={!activeBlock}
            >
              <Highlighter className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={editorRef}>
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do documento..."
            className="text-3xl font-bold border-none p-0 focus-visible:ring-0"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />

          <Separator />

          {/* Content Blocks */}
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={block.id} className={`group relative ${!isReadOnly ? 'hover:bg-gray-50' : ''}`}>
                {!isReadOnly && (
                  <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlock(block.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                {renderBlock(block)}
              </div>
            ))}
          </div>

          {/* Add Block Button (apenas no modo de edição) */}
          {blocks.length === 0 && !isReadOnly && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">Comece adicionando um bloco de conteúdo</p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => addBlock('h1')}>
                  <Heading1 className="w-4 h-4 mr-2" />
                  Título
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('paragraph')}>
                  <Type className="w-4 h-4 mr-2" />
                  Parágrafo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-between items-center border-t">
          {!isReadOnly && (
            <div className="text-sm text-gray-500">
              Atalhos: Ctrl+B (negrito), Ctrl+I (itálico), Ctrl+U (sublinhado), Ctrl+S (salvar)
            </div>
          )}
          <div className="flex space-x-2 ml-auto">
            <Button variant="outline" onClick={onClose}>
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isReadOnly && onSave && (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
