import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useToast } from '@/hooks/use-toast';
import { CustomNode } from './CustomNode';
import { ImageNode } from './ImageNode';
import { ContentEditor } from './ContentEditor';
import { CanvasSidebar } from './CanvasSidebar';
import { ContextMenu } from './ContextMenu';
import { CanvasHeader } from './CanvasHeader';
import TemplateManager from './TemplateManager';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useCanvasHotkeys } from '@/hooks/useCanvasHotkeys';
import { useCanvasOperations } from '@/hooks/useCanvasOperations';
import { CustomNodeData, InfiniteCanvasProps } from '@/types/canvas';
import { DrawingLayer, DrawingPath } from './DrawingLayer';
import { DrawingControls } from './DrawingControls';
import { EdgeType } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Minimize, Maximize, PanelLeftOpen, PanelLeftClose, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ShareFunnelDialog } from '@/components/ShareFunnelDialog';
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
import { FunnelDashboard } from './FunnelDashboard';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

// Move nodeTypes outside component to prevent recreation
const nodeTypes = {
  custom: CustomNode,
  image: ImageNode,
};

interface ExtendedInfiniteCanvasProps extends InfiniteCanvasProps {
  initialCanvasData?: { 
    nodes: Node<CustomNodeData>[]; 
    edges: Edge[];
    drawings?: DrawingPath[];
  };
  onSave?: (canvasData: { 
    nodes: Node<CustomNodeData>[]; 
    edges: Edge[];
    drawings?: DrawingPath[];
  }) => void;
  onOpenDashboard?: () => void;
  isReadOnly?: boolean;
}

const InfiniteCanvasInner = ({ 
  funnelId, 
  funnelName, 
  onFunnelNameChange, 
  initialCanvasData,
  onSave,
  onOpenDashboard,
  isReadOnly = false
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
  const [currentEdgeType, setCurrentEdgeType] = useState<EdgeType>('default');
  const [edgeToDelete, setEdgeToDelete] = useState<string | null>(null);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');
  
  // Drawing states
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [drawings, setDrawings] = useState<DrawingPath[]>([]);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { screenToFlowPosition } = useReactFlow();

  // Check for unsaved changes
  useEffect(() => {
    const currentState = JSON.stringify({ nodes, edges, drawings });
    if (lastSavedState && currentState !== lastSavedState) {
      setHasUnsavedChanges(true);
    } else if (lastSavedState && currentState === lastSavedState) {
      setHasUnsavedChanges(false);
    }
  }, [nodes, edges, drawings, lastSavedState]);

  // Initialize last saved state when initial data loads
  useEffect(() => {
    if (initialCanvasData && !lastSavedState) {
      setLastSavedState(JSON.stringify(initialCanvasData));
    }
  }, [initialCanvasData, lastSavedState]);

  // Custom hooks (apenas no modo de edição)
  const {
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistoryIndex,
    initializeHistory
  } = useCanvasHistory();

  // Unsaved changes hook
  const {
    showSaveDialog,
    navigateWithGuard,
    handleSaveAndNavigate,
    handleDiscardAndNavigate,
    handleCancelNavigation,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    onSave: async () => {
      if (onSave) {
        await onSave({ nodes, edges, drawings });
        const newState = JSON.stringify({ nodes, edges, drawings });
        setLastSavedState(newState);
        setHasUnsavedChanges(false);
      }
    },
  });

  // Update nodes when initialCanvasData changes
  useEffect(() => {
    if (initialCanvasData) {
      setNodes(initialCanvasData.nodes || []);
      setEdges(initialCanvasData.edges || []);
      setDrawings(initialCanvasData.drawings || []);
      // Inicializar o histórico com o estado inicial
      initializeHistory(initialCanvasData.nodes || [], initialCanvasData.edges || []);
    }
  }, [initialCanvasData, setNodes, setEdges, initializeHistory]);

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

    if (!isReadOnly) {
      loadUserPlan();
    }
  }, [isReadOnly]);

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
    saveToHistory: (nds, eds) => saveToHistory(nds || nodes, eds || edges)
  });

  // Handle node updates (apenas no modo de edição)
  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<CustomNodeData>) => {
    if (isReadOnly) return;
    
    console.log('InfiniteCanvas handleUpdateNode called:', { nodeId, updates });
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
    saveToHistory(nodes, edges);
  }, [setNodes, saveToHistory, isReadOnly]);

  const updateNodeData = useCallback((nodeId: string, updates: Partial<CustomNodeData>) => {
    if (isReadOnly) return;
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, [setNodes, isReadOnly]);

  const applyEdgeTypeToAll = useCallback(() => {
    if (isReadOnly) return;
    
    const newEdges = edges.map((edge) => ({
      ...edge,
      type: currentEdgeType,
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 },
    }));
    
    setEdges(newEdges);
    saveToHistory(nodes, newEdges);
    toast({
      title: "Tipo de linha aplicado!",
      description: "O novo tipo de linha foi aplicado a todas as conexões existentes.",
    });
  }, [currentEdgeType, nodes, edges, setEdges, saveToHistory, toast, isReadOnly]);

  // Drawing functions
  const handleToggleDrawingMode = useCallback(() => {
    if (isReadOnly) return;
    console.log('handleToggleDrawingMode called, current isDrawingMode:', isDrawingMode);
    setIsDrawingMode(prev => !prev);
  }, [isDrawingMode, isReadOnly]);

  const handleDrawingComplete = useCallback((drawing: DrawingPath) => {
    if (isReadOnly) return;
    setDrawings(prev => [...prev, drawing]);
  }, [isReadOnly]);

  const handleClearDrawings = useCallback(() => {
    if (isReadOnly) return;
    setDrawings([]);
    toast({
      title: "Desenhos limpos!",
      description: "Todos os desenhos foram removidos do canvas.",
    });
  }, [isReadOnly, toast]);

  const handleLoadTemplate = useCallback((nodes: Node<CustomNodeData>[], edges: Edge[]) => {
    const idMap = new Map();
    
    const newNodes = nodes.map(node => {
      const newId = `node-${Date.now()}-${Math.random()}`;
      idMap.set(node.id, newId);
      return {
        ...node,
        id: newId,
        selected: false,
      };
    });

    const newEdges = edges.map(edge => ({
      ...edge,
      id: `edge-${Date.now()}-${Math.random()}`,
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target,
    }));

    setNodes(newNodes);
    setEdges(newEdges);
    saveToHistory(newNodes, newEdges);
    
    toast({
      title: "Template carregado!",
      description: "Template foi carregado com sucesso.",
    });
  }, [setNodes, setEdges, saveToHistory, toast]);

  const handleSaveTemplate = useCallback(() => {
    return { nodes, edges };
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (isReadOnly) return;
    
    const prevState = undo();
    if (prevState) {
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [undo, setNodes, setEdges, setHistoryIndex, isReadOnly]);

  const handleRedo = useCallback(() => {
    if (isReadOnly) return;
    
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [redo, setNodes, setEdges, setHistoryIndex, isReadOnly]);

  useCanvasHotkeys({
    onUndo: isReadOnly ? () => {} : handleUndo,
    onRedo: isReadOnly ? () => {} : handleRedo,
    onCopy: isReadOnly ? () => {} : copyNodes,
    onPaste: isReadOnly ? () => {} : pasteNodes,
    onDelete: isReadOnly ? () => {} : deleteSelected,
    onSave: isReadOnly ? () => {} : () => {
      if (onSave) {
        onSave({ nodes, edges, drawings });
        const newState = JSON.stringify({ nodes, edges, drawings });
        setLastSavedState(newState);
        setHasUnsavedChanges(false);
      }
    }
  });

  const onDragOver = useCallback((event: React.DragEvent) => {
    if (isReadOnly) return;
    
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, [isReadOnly]);

  const onDrop = useCallback((event: React.DragEvent) => {
    if (isReadOnly) return;
    
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
  }, [screenToFlowPosition, addNode, isReadOnly]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (isReadOnly) return;
      
      const newEdge = {
        ...params,
        type: currentEdgeType,
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
      };
      const newEdges = addEdge(newEdge, edges);
      setEdges(newEdges);
      saveToHistory(nodes, newEdges);
    },
    [nodes, edges, setEdges, saveToHistory, currentEdgeType, isReadOnly]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (isReadOnly) return;
    
    event.stopPropagation();
    setEdgeToDelete(edge.id);
  }, [isReadOnly]);

  const confirmDeleteEdge = useCallback(() => {
    if (edgeToDelete && !isReadOnly) {
      const newEdges = edges.filter((e) => e.id !== edgeToDelete);
      setEdges(newEdges);
      saveToHistory(nodes, newEdges);
      toast({
        title: "Conexão removida!",
        description: "A conexão foi deletada com sucesso.",
      });
      setEdgeToDelete(null);
    }
  }, [edgeToDelete, nodes, edges, setEdges, saveToHistory, toast, isReadOnly]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    // No modo read-only, não deve abrir o editor
    if (isReadOnly) return;
    
    setSelectedNode(node);
    setIsEditorOpen(true);
  }, [isReadOnly]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    if (isReadOnly) return;
    
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  }, [isReadOnly]);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    if (isReadOnly) return;
    
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  }, [isReadOnly]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const saveFunnel = useCallback(async () => {
    if (onSave && !isReadOnly) {
      await onSave({ nodes, edges, drawings });
      const newState = JSON.stringify({ nodes, edges, drawings });
      setLastSavedState(newState);
      setHasUnsavedChanges(false);
    }
  }, [nodes, edges, drawings, onSave, isReadOnly]);

  // Memoize nodeTypes with isReadOnly context and handleUpdateNode
  const nodeTypesWithReadOnly = useMemo(() => ({
    custom: (props: any) => (
      <CustomNode 
        {...props} 
        isReadOnly={isReadOnly} 
        onUpdateNode={isReadOnly ? () => {} : handleUpdateNode}
      />
    ),
    image: (props: any) => (
      <ImageNode 
        {...props} 
        isReadOnly={isReadOnly} 
        onUpdateNode={isReadOnly ? () => {} : handleUpdateNode}
      />
    )
  }), [isReadOnly, handleUpdateNode]);

  return (
    <div className="w-full h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - agora com controle de visibilidade */}
      {!isMinimized && !isReadOnly && isSidebarVisible && (
        <CanvasSidebar 
          showSidebar={true}
          selectedNodeId={selectedNode?.id || null}
          nodes={nodes}
          updateNodeData={updateNodeData}
          onClose={() => setSelectedNode(null)}
          onAddNode={addNode}
          onToggleSidebar={() => setIsSidebarVisible(false)}
          isDrawingMode={isDrawingMode}
          onToggleDrawingMode={handleToggleDrawingMode}
          drawingColor={drawingColor}
          onDrawingColorChange={setDrawingColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          onClearDrawings={handleClearDrawings}
          
        />
      )}
      
      <div className="flex-1 flex flex-col">
        {/* Remover o header completamente no modo read-only */}
        {!isMinimized && !isReadOnly && (
          <CanvasHeader
            funnelName={funnelName}
            onFunnelNameChange={onFunnelNameChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            onExportAsImage={() => {}}
            onExportAsPDF={() => {}}
            onSave={saveFunnel}
            onOpenTemplateManager={!isReadOnly ? () => setIsTemplateManagerOpen(true) : undefined}
            onShareFunnel={!isReadOnly ? () => setIsShareDialogOpen(true) : undefined}
            onOpenDashboard={onOpenDashboard}
            isReadOnly={isReadOnly}
            hasUnsavedChanges={hasUnsavedChanges}
            navigateWithGuard={navigateWithGuard}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible(true)}
          />
        )}

        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={isReadOnly ? () => {} : onNodesChange}
            onEdgesChange={isReadOnly ? () => {} : onEdgesChange}
            onConnect={isReadOnly ? () => {} : onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={isReadOnly ? undefined : onNodeDoubleClick}
            onNodeContextMenu={isReadOnly ? undefined : onNodeContextMenu}
            onPaneContextMenu={isReadOnly ? undefined : onPaneContextMenu}
            onPaneClick={onPaneClick}
            onEdgeClick={isReadOnly ? undefined : onEdgeClick}
            onDragOver={isReadOnly ? undefined : onDragOver}
            onDrop={isReadOnly ? undefined : onDrop}
            nodeTypes={nodeTypesWithReadOnly}
            fitView
            snapToGrid={!isReadOnly}
            snapGrid={[20, 20]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.1}
            maxZoom={4}
            attributionPosition="bottom-left"
            nodesDraggable={!isReadOnly}
            nodesConnectable={!isReadOnly}
            elementsSelectable={!isReadOnly}
          >
            {!isReadOnly && <Controls />}
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
            
            {/* Simplificar o panel para modo read-only */}
            <Panel position="top-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {nodes.length} nós • {edges.length} conexões
                  {isReadOnly && <span className="ml-2 text-blue-600">• Modo Visualização</span>}
                  {hasUnsavedChanges && !isReadOnly && <span className="ml-2 text-orange-600">• Alterações não salvas</span>}
                 </span>
                  {!isMinimized && !isReadOnly && (
                    <DrawingControls
                      currentEdgeType={currentEdgeType}
                      onEdgeTypeChange={setCurrentEdgeType}
                      onApplyEdgeTypeToAll={applyEdgeTypeToAll}
                    />
                  )}
              </div>
            </Panel>

            {!isReadOnly && (
              <Panel position="top-right">
                {/* Botão para minimizar/maximizar */}
                <Button
                  onClick={() => setIsMinimized(!isMinimized)}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-50 shadow-md"
                  title={isMinimized ? "Restaurar interface" : "Minimizar interface"}
                >
                  {isMinimized ? (
                    <Maximize className="w-4 h-4" />
                  ) : (
                    <Minimize className="w-4 h-4" />
                  )}
                </Button>
              </Panel>
            )}

          </ReactFlow>
          
          {/* Drawing Layer - positioned above ReactFlow */}
          <DrawingLayer
            isDrawingMode={isDrawingMode}
            drawingColor={drawingColor}
            strokeWidth={strokeWidth}
            drawings={drawings}
            onDrawingComplete={handleDrawingComplete}
            onClearDrawings={handleClearDrawings}
          />
        </div>
      </div>

      {/* Context Menu (apenas no modo de edição) */}
      {contextMenu && !isMinimized && !isReadOnly && (
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
          onSave={isReadOnly ? undefined : (content, elementName) => updateNodeContent(selectedNode.id, content, elementName)}
          isReadOnly={isReadOnly}
          funnelId={funnelId}
        />
      )}

      {/* Dashboard */}
      <FunnelDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        funnelId={funnelId}
        funnelName={funnelName}
      />

      {/* Template Manager (apenas no modo de edição) */}
      {!isReadOnly && (
        <TemplateManager
          isOpen={isTemplateManagerOpen}
          onClose={() => setIsTemplateManagerOpen(false)}
          onLoadTemplate={handleLoadTemplate}
          onSaveTemplate={handleSaveTemplate}
        />
      )}

      {/* Share Dialog (apenas no modo de edição) */}
      {!isReadOnly && (
        <ShareFunnelDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          funnelId={funnelId}
          funnelName={funnelName}
        />
      )}

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        isOpen={showSaveDialog}
        onSaveAndNavigate={handleSaveAndNavigate}
        onDiscardAndNavigate={handleDiscardAndNavigate}
        onCancel={handleCancelNavigation}
      />

      {/* Alert Dialog para confirmar exclusão de conexão (apenas no modo de edição) */}
      {!isReadOnly && (
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
      )}
    </div>
  );
};

export const InfiniteCanvas = (props: ExtendedInfiniteCanvasProps) => (
  <ReactFlowProvider>
    <InfiniteCanvasInner {...props} />
  </ReactFlowProvider>
);
