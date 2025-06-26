
import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Settings, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomNodeData } from '@/types/canvas';
import { ContentEditor } from './ContentEditor';

interface CustomNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
  isReadOnly?: boolean;
}

export const CustomNode = memo(({ 
  id, 
  data, 
  selected = false, 
  onUpdateNode,
  isReadOnly = false 
}: CustomNodeProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { deleteElements, getNode } = useReactFlow();

  const handleDelete = () => {
    if (isReadOnly) return;
    deleteElements({ nodes: [{ id }] });
  };

  const handleDuplicate = () => {
    if (isReadOnly || !onUpdateNode) return;
    // Implementar lógica de duplicação
  };

  const handleEdit = () => {
    if (isReadOnly) return;
    setIsEditorOpen(true);
  };

  const handleNodeClick = () => {
    // No modo de visualização, se o nó tem conteúdo, abrir o editor em modo somente leitura
    if (isReadOnly && data.content && (data.content.text || data.content.items?.length > 0)) {
      setIsEditorOpen(true);
    }
  };

  const getBackgroundColor = () => {
    switch (data.type) {
      case 'landing-page':
        return 'bg-blue-50 border-blue-200';
      case 'email-capture':
        return 'bg-green-50 border-green-200';
      case 'sales-page':
        return 'bg-yellow-50 border-yellow-200';
      case 'checkout':
        return 'bg-purple-50 border-purple-200';
      case 'thank-you':
        return 'bg-pink-50 border-pink-200';
      case 'upsell':
        return 'bg-orange-50 border-orange-200';
      case 'downsell':
        return 'bg-red-50 border-red-200';
      case 'webinar':
        return 'bg-indigo-50 border-indigo-200';
      case 'survey':
        return 'bg-teal-50 border-teal-200';
      case 'video':
        return 'bg-cyan-50 border-cyan-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getBadgeColor = () => {
    switch (data.type) {
      case 'landing-page':
        return 'bg-blue-100 text-blue-800';
      case 'email-capture':
        return 'bg-green-100 text-green-800';
      case 'sales-page':
        return 'bg-yellow-100 text-yellow-800';
      case 'checkout':
        return 'bg-purple-100 text-purple-800';
      case 'thank-you':
        return 'bg-pink-100 text-pink-800';
      case 'upsell':
        return 'bg-orange-100 text-orange-800';
      case 'downsell':
        return 'bg-red-100 text-red-800';
      case 'webinar':
        return 'bg-indigo-100 text-indigo-800';
      case 'survey':
        return 'bg-teal-100 text-teal-800';
      case 'video':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeDisplayName = () => {
    const typeNames = {
      'landing-page': 'Landing Page',
      'email-capture': 'Captura de Email',
      'sales-page': 'Página de Vendas',
      'checkout': 'Checkout',
      'thank-you': 'Obrigado',
      'upsell': 'Upsell',
      'downsell': 'Downsell',
      'webinar': 'Webinar',
      'survey': 'Pesquisa',
      'video': 'Vídeo',
    };
    return typeNames[data.type] || data.type;
  };

  const hasContent = data.content && (data.content.text || data.content.items?.length > 0);

  return (
    <>
      <Card 
        className={cn(
          'min-w-[200px] max-w-[250px] shadow-md transition-all duration-200',
          getBackgroundColor(),
          selected && 'ring-2 ring-blue-500',
          isReadOnly && hasContent && 'cursor-pointer hover:shadow-lg'
        )}
        onClick={handleNodeClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge className={cn('text-xs font-medium', getBadgeColor())}>
              {getTypeDisplayName()}
            </Badge>
            
            {/* Botões de ação - apenas no modo de edição */}
            {!isReadOnly && (
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-6 w-6 hover:bg-white/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-6 w-6 hover:bg-white/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implementar configurações
                  }}
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Nome do elemento */}
          <div className="mb-2">
            <h3 className="font-medium text-sm text-gray-900 break-words">
              {data.elementName || getTypeDisplayName()}
            </h3>
          </div>

          {/* Preview do conteúdo */}
          {data.content?.text && (
            <div className="text-xs text-gray-600 line-clamp-2 mb-2">
              {data.content.text.substring(0, 100)}...
            </div>
          )}

          {/* Indicador de conteúdo no modo de visualização */}
          {isReadOnly && hasContent && (
            <div className="text-xs text-blue-600 font-medium">
              Clique para ver conteúdo
            </div>
          )}

          {/* Métricas básicas */}
          {data.metrics && (
            <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              <span>Conversão: {data.metrics.conversionRate}%</span>
              <span>Visitas: {data.metrics.visits}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Handles de conexão */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />

      {/* Content Editor */}
      {isEditorOpen && (
        <ContentEditor
          node={{ id, data, position: { x: 0, y: 0 }, type: 'custom' }}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={isReadOnly ? undefined : (content, elementName) => {
            if (onUpdateNode) {
              onUpdateNode(id, { content, elementName });
            }
          }}
          isReadOnly={isReadOnly}
        />
      )}
    </>
  );
});

CustomNode.displayName = 'CustomNode';
