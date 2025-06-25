
import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useToast } from '@/hooks/use-toast';
import { CustomNode } from './CustomNode';
import { ContentEditor } from './ContentEditor';
import { CanvasSidebar } from './CanvasSidebar';
import { ContextMenu } from './ContextMenu';
import { CanvasHeader } from './CanvasHeader';
import { TemplateManager } from './TemplateManager';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useCanvasHotkeys } from '@/hooks/useCanvasHotkeys';
import { useCanvasOperations } from '@/hooks/useCanvasOperations';
import { CustomNodeData, InfiniteCanvasProps, Template } from '@/types/canvas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EdgeTypeSelector } from './EdgeTypeSelector';
import { EdgeType } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Minimize, Maximize } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const nodeTypes = {
  custom: (props: any) => (
    <CustomNode 
      {...props} 
      onUpdateNode={(nodeId: string, updates: Partial<CustomNodeData>) => {
        if (props.onUpdateNode) {
          props.onUpdateNode(nodeId, updates);
        }
      }} 
    />
  ),
};

interface ExtendedInfiniteCanvasProps extends InfiniteCanvasProps {
  initialCanvasData?: { nodes: Node<CustomNodeData>[]; edges: Edge[] };
  onSave?: (canvasData: { nodes: Node<CustomNodeData>[]; edges: Edge[] }) => void;
}

const InfiniteCanvasInner = ({ 
  funnelId, 
  funnelName, 
  onFunnelNameChange, 
  initialCanvasData,
  onSave 
}: ExtendedInfiniteCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(
    initialCanvasData?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialCanvasData?.edges || []
  );
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null);
  const [currentEdgeType, setCurrentEdgeType] = useState<EdgeType>('straight');
  const [edgeToDelete, setEdgeToDelete] = useState<string | null>(null);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [userPlan, setUserPlan] = useState<string>('free');
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { screenToFlowPosition, getViewport } = useReactFlow();

  // Load user plan
  useEffect(() => {
    const loadUserPlan = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('plan_type')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error loading user plan:', error);
            return;
          }

          setUserPlan(profileData.plan_type || 'free');
        }
      } catch (error) {
        console.error('Error loading user plan:', error);
      }
    };

    loadUserPlan();
  }, []);

  // Custom hooks
  const {
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistoryIndex
  } = useCanvasHistory();

  const {
    addNode,
    duplicateNode,
    deleteNode,
    copyNodes,
    pasteNodes,
    deleteSelected,
    updateNodeContent
  } = useCanvasOperations({
    nodes,
    edges,
    setNodes,
    setEdges,
    saveToHistory
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      const currentData = JSON.stringify({ nodes, edges });
      if (currentData !== lastSaved && onSave) {
        onSave({ nodes, edges });
        setLastSaved(currentData);
      }
    };

    const timeoutId = setTimeout(autoSave, 2000); // Auto-save after 2 seconds of inactivity
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, lastSaved, onSave]);

  // Handle node updates
  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<CustomNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
    saveToHistory();
  }, [setNodes, saveToHistory]);

  // Modificar os nodeTypes para incluir a função de atualização
  const customNodeTypes = {
    custom: (props: any) => (
      <CustomNode {...props} onUpdateNode={handleUpdateNode} />
    ),
  };

  // Template operations
  const handleLoadTemplate = useCallback((template: Template) => {
    // Generate new IDs for nodes and edges to avoid conflicts
    const idMap = new Map();
    
    const newNodes = template.nodes.map(node => {
      const newId = `node-${Date.now()}-${Math.random()}`;
      idMap.set(node.id, newId);
      return {
        ...node,
        id: newId,
        selected: false,
      };
    });

    const newEdges = template.edges.map(edge => ({
      ...edge,
      id: `edge-${Date.now()}-${Math.random()}`,
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
    saveToHistory();
    
    toast({
      title: "Template carregado!",
      description: `Template "${template.name}" foi carregado com sucesso.`,
    });
  }, [setNodes, setEdges, saveToHistory, toast]);

  const handleSaveTemplate = useCallback(() => {
    return { nodes, edges };
  }, [nodes, edges]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [undo, setNodes, setEdges, setHistoryIndex]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [redo, setNodes, setEdges, setHistoryIndex]);

  // Hotkeys
  useCanvasHotkeys({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onCopy: copyNodes,
    onPaste: pasteNodes,
    onDelete: deleteSelected,
    onSave: () => {
      if (onSave) {
        onSave({ nodes, edges });
      }
    }
  });

  // Drag and Drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    
    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(type, position);
  }, [screenToFlowPosition, addNode]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: currentEdgeType,
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory, currentEdgeType]
  );

  // Função para deletar edge ao clicar com confirmação
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setEdgeToDelete(edge.id);
  }, []);

  const confirmDeleteEdge = useCallback(() => {
    if (edgeToDelete) {
      setEdges((edges) => edges.filter((e) => e.id !== edgeToDelete));
      saveToHistory();
      toast({
        title: "Conexão removida!",
        description: "A conexão foi deletada com sucesso.",
      });
      setEdgeToDelete(null);
    }
  }, [edgeToDelete, setEdges, saveToHistory, toast]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
    setIsEditorOpen(true);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const saveFunnel = useCallback(() => {
    if (onSave) {
      onSave({ nodes, edges });
    }
  }, [nodes, edges, onSave]);

  // Função melhorada para exportar como imagem
  const exportAsImage = useCallback(async () => {
    if (reactFlowWrapper.current) {
      try {
        // Aguardar um momento para garantir que tudo esteja renderizado
        await new Promise(resolve => setTimeout(resolve, 100));

        // Forçar re-renderização dos SVGs
        const svgElements = reactFlowWrapper.current.querySelectorAll('.react-flow__edges svg');
        svgElements.forEach((svg: any) => {
          svg.style.position = 'absolute';
          svg.style.zIndex = '1';
          svg.style.pointerEvents = 'none';
        });

        const pathElements = reactFlowWrapper.current.querySelectorAll('.react-flow__edge path');
        pathElements.forEach((path: any) => {
          path.style.stroke = '#10b981';
          path.style.strokeWidth = '2';
          path.style.fill = 'none';
        });

        // Aguardar mais um momento após aplicar os estilos
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(reactFlowWrapper.current, {
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: true,
          scale: 2,
          logging: false,
          width: reactFlowWrapper.current.scrollWidth,
          height: reactFlowWrapper.current.scrollHeight,
          ignoreElements: (element) => {
            return element.classList.contains('react-flow__minimap') ||
                   element.classList.contains('react-flow__controls') ||
                   element.classList.contains('react-flow__panel');
          },
          onclone: (clonedDoc, element) => {
            // Garantir que todos os SVGs estejam visíveis no clone
            const clonedSvgs = clonedDoc.querySelectorAll('.react-flow__edges svg');
            clonedSvgs.forEach((svg: any) => {
              svg.style.position = 'absolute';
              svg.style.zIndex = '10';
              svg.style.display = 'block';
              svg.style.visibility = 'visible';
              svg.style.opacity = '1';
            });
            
            const clonedPaths = clonedDoc.querySelectorAll('.react-flow__edge path');
            clonedPaths.forEach((path: any) => {
              path.style.stroke = '#10b981';
              path.style.strokeWidth = '2';
              path.style.fill = 'none';
              path.style.display = 'block';
              path.style.visibility = 'visible';
              path.style.opacity = '1';
            });

            // Garantir que o container das edges esteja visível
            const edgesContainer = clonedDoc.querySelector('.react-flow__edges');
            if (edgesContainer) {
              (edgesContainer as any).style.position = 'absolute';
              (edgesContainer as any).style.zIndex = '10';
              (edgesContainer as any).style.display = 'block';
              (edgesContainer as any).style.visibility = 'visible';
              (edgesContainer as any).style.opacity = '1';
            }
          }
        });

        const link = document.createElement('a');
        link.download = `${funnelName}-funnel.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        toast({
          title: "Imagem exportada!",
          description: "O funil foi exportado como PNG com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao exportar imagem:', error);
        toast({
          title: "Erro",
          description: "Erro ao exportar imagem.",
          variant: "destructive",
        });
      }
    }
  }, [funnelName, toast]);

  // Função melhorada para exportar como PDF
  const exportAsPDF = useCallback(async () => {
    if (reactFlowWrapper.current) {
      try {
        // Aguardar um momento para garantir que tudo esteja renderizado
        await new Promise(resolve => setTimeout(resolve, 100));

        // Forçar re-renderização dos SVGs
        const svgElements = reactFlowWrapper.current.querySelectorAll('.react-flow__edges svg');
        svgElements.forEach((svg: any) => {
          svg.style.position = 'absolute';
          svg.style.zIndex = '1';
          svg.style.pointerEvents = 'none';
        });

        const pathElements = reactFlowWrapper.current.querySelectorAll('.react-flow__edge path');
        pathElements.forEach((path: any) => {
          path.style.stroke = '#10b981';
          path.style.strokeWidth = '2';
          path.style.fill = 'none';
        });

        // Aguardar mais um momento após aplicar os estilos
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(reactFlowWrapper.current, {
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: true,
          scale: 2,
          logging: false,
          width: reactFlowWrapper.current.scrollWidth,
          height: reactFlowWrapper.current.scrollHeight,
          ignoreElements: (element) => {
            return element.classList.contains('react-flow__minimap') ||
                   element.classList.contains('react-flow__controls') ||
                   element.classList.contains('react-flow__panel');
          },
          onclone: (clonedDoc, element) => {
            // Garantir que todos os SVGs estejam visíveis no clone
            const clonedSvgs = clonedDoc.querySelectorAll('.react-flow__edges svg');
            clonedSvgs.forEach((svg: any) => {
              svg.style.position = 'absolute';
              svg.style.zIndex = '10';
              svg.style.display = 'block';
              svg.style.visibility = 'visible';
              svg.style.opacity = '1';
            });
            
            const clonedPaths = clonedDoc.querySelectorAll('.react-flow__edge path');
            clonedPaths.forEach((path: any) => {
              path.style.stroke = '#10b981';
              path.style.strokeWidth = '2';
              path.style.fill = 'none';
              path.style.display = 'block';
              path.style.visibility = 'visible';
              path.style.opacity = '1';
            });

            // Garantir que o container das edges esteja visível
            const edgesContainer = clonedDoc.querySelector('.react-flow__edges');
            if (edgesContainer) {
              (edgesContainer as any).style.position = 'absolute';
              (edgesContainer as any).style.zIndex = '10';
              (edgesContainer as any).style.display = 'block';
              (edgesContainer as any).style.visibility = 'visible';
              (edgesContainer as any).style.opacity = '1';
            }
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${funnelName}-funnel.pdf`);

        toast({
          title: "PDF exportado!",
          description: "O funil foi exportado como PDF com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        toast({
          title: "Erro",
          description: "Erro ao exportar PDF.",
          variant: "destructive",
        });
      }
    }
  }, [funnelName, toast]);

  return (
    <div className="w-full h-screen flex bg-gray-50 dark:bg-gray-900">
      {!isMinimized && <CanvasSidebar onAddNode={addNode} />}
      
      <div className="flex-1 flex flex-col">
        {!isMinimized && (
          <CanvasHeader
            funnelName={funnelName}
            onFunnelNameChange={onFunnelNameChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            onExportAsImage={exportAsImage}
            onExportAsPDF={exportAsPDF}
            onSave={saveFunnel}
            onOpenTemplateManager={userPlan !== 'free' ? () => setIsTemplateManagerOpen(true) : undefined}
          />
        )}

        {/* Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeContextMenu={onNodeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            onEdgeClick={onEdgeClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={customNodeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.1}
            maxZoom={4}
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap 
              nodeColor="#10b981"
              maskColor="rgba(0, 0, 0, 0.1)"
              position="bottom-right"
            />
            <Background 
              variant={BackgroundVariant.Lines}
              gap={20} 
              size={1}
              color="#e5e7eb"
            />
            
            <Panel position="top-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {nodes.length} nós • {edges.length} conexões
                </span>
                {!isMinimized && (
                  <EdgeTypeSelector 
                    currentType={currentEdgeType}
                    onTypeChange={setCurrentEdgeType}
                  />
                )}
              </div>
            </Panel>

            {/* Minimize/Maximize Button */}
            <Panel position="top-right">
              <Button
                onClick={() => setIsMinimized(!isMinimized)}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 shadow-md"
              >
                {isMinimized ? (
                  <Maximize className="w-4 h-4" />
                ) : (
                  <Minimize className="w-4 h-4" />
                )}
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && !isMinimized && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={() => setContextMenu(null)}
          onDuplicate={duplicateNode}
          onDelete={deleteNode}
          onCopy={copyNodes}
          onPaste={pasteNodes}
        />
      )}

      {/* Content Editor */}
      {isEditorOpen && selectedNode && !isMinimized && (
        <ContentEditor
          node={selectedNode}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={(content, elementName) => updateNodeContent(selectedNode.id, content, elementName)}
        />
      )}

      {/* Template Manager - só renderiza se o usuário não for free */}
      {userPlan !== 'free' && (
        <TemplateManager
          isOpen={isTemplateManagerOpen}
          onClose={() => setIsTemplateManagerOpen(false)}
          onLoadTemplate={handleLoadTemplate}
          onSaveTemplate={handleSaveTemplate}
        />
      )}

      {/* Alert Dialog para confirmar exclusão de conexão */}
      <AlertDialog open={!!edgeToDelete} onOpenChange={() => setEdgeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Conexão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta conexão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEdgeToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEdge}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const InfiniteCanvas = (props: ExtendedInfiniteCanvasProps) => (
  <ReactFlowProvider>
    <InfiniteCanvasInner {...props} />
  </ReactFlowProvider>
);
