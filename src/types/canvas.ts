
import { Node, Edge } from '@xyflow/react';

export interface NodeContent {
  title?: string;
  description?: string;
  items?: any[];
}

export interface CustomNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  type: string;
  content: NodeContent | string | null;
  hasContent: boolean;
  customIcon?: string;
  customColor?: string;
  nodeColor?: string;
  nodeType?: string;
  icon?: string;
  elementName?: string;
  showHandle?: boolean;
  link?: string;
}

export interface CanvasState {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
}

export interface InfiniteCanvasProps {
  funnelId: string;
  funnelName: string;
  onFunnelNameChange: (name: string) => void;
  initialCanvasData?: { nodes: Node<CustomNodeData>[]; edges: Edge[] };
  onSave?: (canvasData: { nodes: Node<CustomNodeData>[]; edges: Edge[] }) => void;
  isReadOnly?: boolean;
}

export type EdgeType = 'straight' | 'default';

export interface Template {
  id: string;
  name: string;
  description: string;
  category?: string;
  icon?: React.ReactNode;
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  createdAt: string;
}
