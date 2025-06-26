
import { AdvancedContentEditor } from './AdvancedContentEditor';
import { Node } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';

interface ContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: NodeContent, elementName?: string) => void;
}

export const ContentEditor = ({ node, isOpen, onClose, onSave }: ContentEditorProps) => {
  return (
    <AdvancedContentEditor
      node={node}
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
    />
  );
};
