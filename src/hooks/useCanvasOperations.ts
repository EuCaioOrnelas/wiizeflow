
import { useCallback, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { CustomNodeData, NodeContent } from '@/types/canvas';
import { useToast } from '@/hooks/use-toast';

interface UseCanvasOperationsProps {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  setNodes: (nodes: Node<CustomNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveToHistory: (nodes: Node<CustomNodeData>[], edges: Edge[]) => void;
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
      case 'prospeccao':
        return 'Prospecção';
      case 'conversapresencial':
        return 'Conversa Presencial';
      case 'indicacao':
        return 'Indicação';
      case 'text':
        return 'Anotação';
      case 'wait':
        return 'Tempo de espera';
      case 'formulario':
        return 'Formulário';
      case 'listacontatos':
        return 'Lista de Contatos';
      case 'vendafechada':
        return 'Venda Fechada';
      case 'vendaperdida':
        return 'Venda Perdida';
      case 'image':
        return 'Imagem';
      case 'other':
        return 'Customizado';
      default:
        return `${type} Node`;
    }
  };

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const nodeType = type === 'image' ? 'image' : 'custom';
    const newNode: Node<CustomNodeData> = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: getNodeLabel(type),
        type,
        content: null,
        hasContent: false,
        customIcon: type === 'other' ? '📝' : undefined,
        customColor: type === 'other' ? '#6B7280' : undefined,
        // Default dimensions for image nodes
        ...(type === 'image' && {
          width: 200,
          height: 150,
        }),
      },
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    saveToHistory(newNodes, edges);
  }, [nodes, edges, setNodes, saveToHistory]);

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
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      saveToHistory(newNodes, edges);
    }
  }, [nodes, edges, setNodes, saveToHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    setNodes(newNodes);
    setEdges(newEdges);
    saveToHistory(newNodes, newEdges);
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

      const allNodes = [...nodes, ...newNodes];
      const allEdges = [...edges, ...newEdges];
      setNodes(allNodes);
      setEdges(allEdges);
      saveToHistory(allNodes, allEdges);
      
      toast({
        title: "Colado!",
        description: `${newNodes.length} nó(s) colado(s)`,
      });
    }
  }, [clipboard, nodes, edges, setNodes, setEdges, saveToHistory, toast]);

  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedNodeIds = selectedNodes.map(node => node.id);
    
    const newNodes = nodes.filter(node => !node.selected);
    const newEdges = edges.filter(edge => 
      !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
    );
    setNodes(newNodes);
    setEdges(newEdges);
    saveToHistory(newNodes, newEdges);
  }, [nodes, edges, setNodes, setEdges, saveToHistory]);

  const updateNodeContent = useCallback((nodeId: string, content: NodeContent, elementName?: string) => {
    const updatedNodes = nodes.map(node => 
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
    );
    setNodes(updatedNodes);
    saveToHistory(updatedNodes, edges);
  }, [nodes, edges, setNodes, saveToHistory]);

  // Return the functions that Builder.tsx expects
  return {
    addNode,
    duplicateNode,
    deleteNode,
    copyNodes,
    pasteNodes,
    deleteSelected,
    updateNodeContent,
    onNodesChange: () => {},
    onEdgesChange: () => {},
    onConnect: () => {},
    updateNodeData: (nodeId: string, updates: Partial<CustomNodeData>) => {
      setNodes(nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      ));
    },
    duplicateSelected: () => {
      const selectedNodes = nodes.filter(node => node.selected);
      selectedNodes.forEach(node => duplicateNode(node.id));
    }
  };
};
