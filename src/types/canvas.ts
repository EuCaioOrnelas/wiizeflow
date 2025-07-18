
import { Node, Edge } from '@xyflow/react';

export interface NodeContent {
  title?: string;
  description?: string;
  metrics?: string;
  items?: any[];
}

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  content: NodeContent | null;
  hasContent: boolean;
  customIcon?: string; // For emoji
  customColor?: string; // For icon background color
  nodeColor?: string; // For node background color
  // Image-specific properties
  imageUrl?: string;
  width?: number;
  height?: number;
}

export interface CanvasState {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  drawings?: import('../components/canvas/DrawingLayer').DrawingPath[];
}

export interface InfiniteCanvasProps {
  funnelId: string;
  funnelName: string;
  onFunnelNameChange: (name: string) => void;
  initialCanvasData?: { nodes: Node<CustomNodeData>[]; edges: Edge[] };
  onSave?: (canvasData: { nodes: Node<CustomNodeData>[]; edges: Edge[] }) => void;
  onOpenDashboard?: () => void;
  isReadOnly?: boolean;
}

export type EdgeType = 'straight' | 'default';

export interface Template {
  id: string;
  name: string;
  description: string;
  category?: string; // Added for TemplateManager compatibility
  icon?: React.ReactNode; // Added for TemplateManager compatibility
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  createdAt: string;
}
