import { Node, Edge } from '@xyflow/react';

export interface NodeContent {
  title?: string;
  description?: string;
  items?: any[];
}

export interface NodeMetrics {
  conversionRate: number;
  visits: number;
}

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  content: NodeContent | null;
  hasContent: boolean;
  customIcon?: string; // For emoji
  customColor?: string; // For icon background color
  nodeColor?: string; // For node background color
  elementName?: string;
  metrics?: NodeMetrics;
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
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  createdAt: string;
}
