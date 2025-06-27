
import { AdvancedContentEditor } from './AdvancedContentEditor';
import { Node } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';

// Interface para as propriedades do componente
interface ContentEditorProps {
  node: Node<CustomNodeData>;                                    // Node do canvas a ser editado
  isOpen: boolean;                                              // Estado de abertura do editor
  onClose: () => void;                                          // Função para fechar o editor
  onSave?: (content: NodeContent, elementName?: string) => void; // Função para salvar alterações
  isReadOnly?: boolean;                                         // Modo somente leitura
}

/**
 * Componente wrapper para o editor de conteúdo do canvas
 * 
 * Este componente serve como uma camada de abstração sobre o
 * AdvancedContentEditor, permitindo futuras customizações
 * sem afetar a implementação principal do editor.
 * 
 * Funcionalidades:
 * - Repassa todas as props para o AdvancedContentEditor
 * - Permite modo somente leitura
 * - Interface consistente para edição de nodes
 */
export const ContentEditor = ({ 
  node, 
  isOpen, 
  onClose, 
  onSave, 
  isReadOnly = false 
}: ContentEditorProps) => {
  return (
    <AdvancedContentEditor
      node={node}
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      isReadOnly={isReadOnly}
    />
  );
};
