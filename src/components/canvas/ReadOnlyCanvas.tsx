
import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { ContentEditor } from './ContentEditor';
import { CustomNodeData } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const nodeTypes = {
  custom: (props: any) => (
    <CustomNode 
      {...props} 
      readOnly={true}
      onUpdateNode={() => {}} // Função vazia para modo somente leitura
    />
  ),
};

interface ReadOnlyCanvasProps {
  funnelName: string;
  initialCanvasData: { nodes: Node<CustomNodeData>[]; edges: Edge[] };
  allowDownload: boolean;
  shareToken: string;
}

const ReadOnlyCanvasInner = ({ 
  funnelName, 
  initialCanvasData,
  allowDownload,
  shareToken
}: ReadOnlyCanvasProps) => {
  const [nodes] = useNodesState<Node<CustomNodeData>>(
    initialCanvasData?.nodes || []
  );
  const [edges] = useEdgesState(
    initialCanvasData?.edges || []
  );
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
    setIsEditorOpen(true);
  }, []);

  const handleDownloadTemplate = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Login necessário",
          description: "Você precisa estar logado para baixar este template.",
          variant: "destructive",
        });
        return;
      }

      // Criar um novo funil baseado no template
      const templateName = `${funnelName} (Template)`;
      
      const { data, error } = await supabase
        .from('funnels')
        .insert({
          name: templateName,
          canvas_data: JSON.parse(JSON.stringify({ nodes, edges })),
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
        toast({
          title: "Erro",
          description: "Erro ao baixar template.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Template baixado!",
        description: `O template "${templateName}" foi adicionado aos seus funis.`,
      });

      // Redirecionar para o builder do novo funil
      window.location.href = `/builder/${data.id}`;
      
    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao baixar template.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {funnelName}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualização compartilhada • Somente leitura
              </p>
            </div>
          </div>
          
          {allowDownload && (
            <Button
              onClick={handleDownloadTemplate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          attributionPosition="bottom-left"
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          preventScrolling={false}
        >
          <Controls showInteractive={false} />
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
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Content Editor em modo somente leitura */}
      {isEditorOpen && selectedNode && (
        <ContentEditor
          node={selectedNode}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={() => {}} // Função vazia para modo somente leitura
          readOnly={true}
        />
      )}
    </div>
  );
};

export const ReadOnlyCanvas = (props: ReadOnlyCanvasProps) => (
  <ReactFlowProvider>
    <ReadOnlyCanvasInner {...props} />
  </ReactFlowProvider>
);
