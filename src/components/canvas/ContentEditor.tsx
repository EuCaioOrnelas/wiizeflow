
import { AdvancedContentEditor } from './AdvancedContentEditor';
import { Node } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';

interface ContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: NodeContent, elementName?: string) => void;
  isReadOnly?: boolean;
  funnelId?: string;
}

export const ContentEditor = ({ node, isOpen, onClose, onSave, isReadOnly = false, funnelId }: ContentEditorProps) => {
  return (
    <AdvancedContentEditor
      node={node}
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      isReadOnly={isReadOnly}
      funnelId={funnelId}
    />
  );
};
