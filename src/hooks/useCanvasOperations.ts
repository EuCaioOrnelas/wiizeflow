import { useCallback, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';
import { useToast } from '@/hooks/use-toast';

interface UseCanvasOperationsProps {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  setNodes: (nodes: Node<CustomNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveToHistory: () => void;
}

export const useCanvasOperations = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  saveToHistory
}: UseCanvasOperationsProps) => {
  const [clipboard, setClipboard] = useState<{ nodes: Node<CustomNodeData>[]; edges: Edge[] } | null>(null);
  const { toast } = useToast();

  const getNodeLabel = (type: string) => {
    switch (type) {
      case 'capture':
        return 'Página de Captura';
      case 'sales':
        return 'Página de Vendas';
      case 'upsell':
        return 'Página de Upsell';
      case 'downsell':
        return 'Página de Downsell';
      case 'thankyou':
        return 'Página de Obrigado';
      case 'checkout':
        return 'Checkout';
      case 'email':
        return 'E-mail';
      case 'whatsapp':
        return 'WhatsApp';
      case 'sms':
        return 'SMS';
      case 'call':
        return 'Ligação';
      case 'dminstagram':
        return 'DM Instagram';
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'Youtube';
      case 'tiktok':
        return 'Tik Tok';
      case 'metaads':
        return 'Meta Ads';
      case 'googleads':
        return 'Google Ads';
      case 'blog':
        return 'Blog';
      case 'googlebusiness':
        return 'Google meu negócio';
      case 'text':
        return 'Anotação';
      case 'wait':
        return 'Tempo de espera';
      case 'other':
        return 'Customizado';
      default:
        return `${type} Node`;
    }
  };

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: Node<CustomNodeData> = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position,
      data: {
        label: getNodeLabel(type),
        type,
        content: null,
        hasContent: false,
        customIcon: type === 'other' ? '📝' : undefined,
        customColor: type === 'other' ? '#6B7280' : undefined,
      },
    };
    setNodes([...nodes, newNode]);
    saveToHistory();
  }, [nodes, setNodes, saveToHistory]);

  const duplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const newNode: Node<CustomNodeData> = {
        ...node,
        id: `node-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      };
      setNodes([...nodes, newNode]);
      saveToHistory();
    }
  }, [nodes, setNodes, saveToHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
    saveToHistory();
  }, [nodes, edges, setNodes, setEdges, saveToHistory]);

  const copyNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedNodeIds = selectedNodes.map(node => node.id);
    const selectedEdges = edges.filter(edge => 
      selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target)
    );
    
    if (selectedNodes.length > 0) {
      setClipboard({ nodes: selectedNodes, edges: selectedEdges });
      toast({
        title: "Copiado!",
        description: `${selectedNodes.length} nó(s) copiado(s)`,
      });
    }
  }, [nodes, edges, toast]);

  const pasteNodes = useCallback(() => {
    if (clipboard) {
      const idMap = new Map();
      const newNodes: Node<CustomNodeData>[] = clipboard.nodes.map(node => {
        const newId = `node-${Date.now()}-${Math.random()}`;
        idMap.set(node.id, newId);
        return {
          ...node,
          id: newId,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          selected: false,
        };
      });

      const newEdges = clipboard.edges.map(edge => ({
        ...edge,
        id: `edge-${Date.now()}-${Math.random()}`,
        source: idMap.get(edge.source),
        target: idMap.get(edge.target),
      }));

      setNodes([...nodes, ...newNodes]);
      setEdges([...edges, ...newEdges]);
      saveToHistory();
      
      toast({
        title: "Colado!",
        description: `${newNodes.length} nó(s) colado(s)`,
      });
    }
  }, [clipboard, nodes, edges, setNodes, setEdges, saveToHistory, toast]);

  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedNodeIds = selectedNodes.map(node => node.id);
    
    setNodes(nodes.filter(node => !node.selected));
    setEdges(edges.filter(edge => 
      !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
    ));
    saveToHistory();
  }, [nodes, edges, setNodes, setEdges, saveToHistory]);

  const updateNodeContent = useCallback((nodeId: string, content: NodeContent, elementName?: string) => {
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              content,
              hasContent: !!content && Object.keys(content).length > 0,
              ...(elementName && { label: elementName })
            }
          }
        : node
    ));
    saveToHistory();
  }, [nodes, setNodes, saveToHistory]);

  return {
    addNode,
    duplicateNode,
    deleteNode,
    copyNodes,
    pasteNodes,
    deleteSelected,
    updateNodeContent
  };
};
