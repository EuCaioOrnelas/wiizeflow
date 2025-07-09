import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  MousePointer, 
  Mail, 
  MessageCircle, 
  ShoppingCart, 
  Heart,
  FileText,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Instagram,
  Youtube,
  Play,
  Megaphone,
  Globe,
  Building2,
  Clock,
  Phone,
  X,
  Users,
  Handshake,
  UserPlus,
  ClipboardList,
  UserCheck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  PanelLeftClose,
  Home,
  Image,
  PenTool,
  Edit3,
  
  Trash2,
  Palette
} from 'lucide-react';
import { Node } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const blockCategories = [
  {
    name: 'Ferramentas',
    expanded: true,
    isTools: true,
    blocks: []
  },
  {
    name: 'Páginas',
    expanded: true,
    blocks: [
      { type: 'capture', name: 'Página de Captura', icon: MousePointer, color: 'bg-blue-500' },
      { type: 'sales', name: 'Página de Vendas', icon: Target, color: 'bg-green-500' },
      { type: 'upsell', name: 'Página de Upsell', icon: TrendingUp, color: 'bg-emerald-500' },
      { type: 'downsell', name: 'Página de Downsell', icon: TrendingDown, color: 'bg-orange-500' },
      { type: 'thankyou', name: 'Página de Obrigado', icon: Heart, color: 'bg-purple-500' },
      { type: 'checkout', name: 'Checkout', icon: ShoppingCart, color: 'bg-red-500' },
    ]
  },
  {
    name: 'Tráfego',
    expanded: true,
    blocks: [
      { type: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
      { type: 'youtube', name: 'Youtube', icon: Youtube, color: 'bg-red-600' },
      { type: 'tiktok', name: 'Tik Tok', icon: Play, color: 'bg-black' },
      { type: 'metaads', name: 'Meta Ads', icon: Megaphone, color: 'bg-blue-600' },
      { type: 'googleads', name: 'Google Ads', icon: Target, color: 'bg-yellow-500' },
      { type: 'blog', name: 'Blog', icon: FileText, color: 'bg-slate-600' },
      { type: 'googlebusiness', name: 'Google meu negócio', icon: Building2, color: 'bg-green-600' },
      { type: 'prospeccao', name: 'Prospecção', icon: Users, color: 'bg-teal-500' },
      { type: 'conversapresencial', name: 'Conversa Presencial', icon: Handshake, color: 'bg-amber-600' },
      { type: 'indicacao', name: 'Indicação', icon: UserPlus, color: 'bg-cyan-500' },
    ]
  },
  {
    name: 'Comunicação',
    expanded: true,
    blocks: [
      { type: 'email', name: 'E-mail', icon: Mail, color: 'bg-yellow-500' },
      { type: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
      { type: 'sms', name: 'SMS', icon: MessageCircle, color: 'bg-blue-400' },
      { type: 'call', name: 'Ligação', icon: Phone, color: 'bg-indigo-500' },
      { type: 'dminstagram', name: 'DM Instagram', icon: Instagram, color: 'bg-pink-400' },
    ]
  },
  {
    name: 'Outros',
    expanded: true,
    blocks: [
      { type: 'image', name: 'Imagem', icon: Image, color: 'bg-gray-600' },
      { type: 'text', name: 'Anotação', icon: FileText, color: 'bg-indigo-500' },
      { type: 'wait', name: 'Tempo de espera', icon: Clock, color: 'bg-amber-500' },
      { type: 'formulario', name: 'Formulário', icon: ClipboardList, color: 'bg-violet-500' },
      { type: 'listacontatos', name: 'Lista de Contatos', icon: UserCheck, color: 'bg-blue-700' },
      { type: 'vendafechada', name: 'Venda Fechada', icon: CheckCircle, color: 'bg-green-700' },
      { type: 'vendaperdida', name: 'Venda Perdida', icon: XCircle, color: 'bg-red-700' },
      { type: 'other', name: 'Customizado', icon: Plus, color: 'bg-gray-500' },
    ]
  }
];

const drawingColors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', 
  '#800080', '#FFC0CB', '#A52A2A', '#808080',
];

interface CanvasSidebarProps {
  showSidebar: boolean;
  selectedNodeId: string | null;
  nodes: Node<CustomNodeData>[];
  updateNodeData: (nodeId: string, updates: Partial<CustomNodeData>) => void;
  onClose: () => void;
  onAddNode?: (type: string, position: { x: number; y: number }) => void;
  onToggleSidebar?: () => void;
  // Drawing controls
  isDrawingMode?: boolean;
  onToggleDrawingMode?: () => void;
  drawingColor?: string;
  onDrawingColorChange?: (color: string) => void;
  strokeWidth?: number;
  onStrokeWidthChange?: (width: number) => void;
  onClearDrawings?: () => void;
  
}

export const CanvasSidebar = ({ 
  showSidebar, 
  selectedNodeId, 
  nodes, 
  updateNodeData, 
  onClose,
  onAddNode,
  onToggleSidebar,
  // Drawing props
  isDrawingMode = false,
  onToggleDrawingMode,
  drawingColor = '#000000',
  onDrawingColorChange,
  strokeWidth = 3,
  onStrokeWidthChange,
  onClearDrawings,
  
}: CanvasSidebarProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Ferramentas': true,
    'Páginas': false,
    'Tráfego': false,
    'Comunicação': false,
    'Outros': false,
  });

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleDragStart = (event: React.DragEvent, blockType: string) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const filteredCategories = blockCategories.map(category => ({
    ...category,
    blocks: category.blocks.filter(block => 
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.isTools || category.blocks.length > 0);

  // Get selected node if one is selected
  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;

  if (!showSidebar) {
    return null;
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {selectedNode ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Editar Elemento
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Elementos
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={handleGoHome}
                variant="outline"
                size="sm"
                title="Voltar para o Dashboard"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                onClick={onToggleSidebar}
                variant="outline"
                size="sm"
                title="Ocultar menu lateral"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Editor */}
      {selectedNode && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do Elemento
              </label>
              <Input
                value={selectedNode.data.label}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                placeholder="Nome do elemento"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo
              </label>
              <Input
                value={selectedNode.data.type}
                disabled
                className="bg-gray-100 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Search and Elements */}
      {!selectedNode && (
        <>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar elementos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="flex items-center justify-between w-full mb-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <span>{category.name}</span>
                    {expandedCategories[category.name] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedCategories[category.name] && (
                    <div className="space-y-2">
                      {/* Ferramentas de Desenho */}
                      {category.isTools ? (
                        <div className="space-y-3">
                          {/* Toggle Desenho */}
                          <Button
                            onClick={onToggleDrawingMode}
                            variant={isDrawingMode ? "default" : "outline"}
                            size="sm"
                            className={`w-full gap-2 transition-all duration-200 ${
                              isDrawingMode 
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                                : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            <PenTool className="w-4 h-4" />
                            {isDrawingMode ? 'Desativar Desenho' : 'Ativar Desenho'}
                          </Button>

                          {/* Controles de Desenho */}
                          {isDrawingMode && (
                            <div className="bg-muted/50 rounded-lg p-3 space-y-3">
                              {/* Cores */}
                              <div>
                                <label className="text-xs font-medium text-foreground mb-2 block">
                                  Cor:
                                </label>
                                <div className="grid grid-cols-6 gap-2 mb-2">
                                  {drawingColors.map((color) => (
                                    <button
                                      key={color}
                                       className={`w-6 h-6 rounded border-2 transition-all ${
                                         drawingColor === color 
                                           ? 'border-primary scale-110 shadow-lg' 
                                           : 'border-muted-foreground/20 hover:scale-105'
                                       }`}
                                      style={{ backgroundColor: color }}
                                      onClick={() => onDrawingColorChange?.(color)}
                                    />
                                  ))}
                                </div>
                                <input
                                  type="color"
                                  value={drawingColor}
                                  onChange={(e) => onDrawingColorChange?.(e.target.value)}
                                  className="w-full h-6 rounded border border-input cursor-pointer"
                                />
                              </div>

                              {/* Grossura */}
                              <div>
                                <label className="text-xs font-medium text-foreground mb-2 block">
                                  Grossura: {strokeWidth}px
                                </label>
                                <Slider
                                  value={[strokeWidth]}
                                  onValueChange={(value) => onStrokeWidthChange?.(value[0])}
                                  max={20}
                                  min={1}
                                  step={1}
                                  className="w-full"
                                />
                              </div>

                              {/* Ações */}
                              <div className="flex gap-2">
                                <Button
                                  onClick={onClearDrawings}
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  <span className="text-xs">Limpar</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Elementos Normais */
                        category.blocks.map((block) => (
                          <div
                            key={block.type}
                            draggable
                            onDragStart={(e) => handleDragStart(e, block.type)}
                            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-grab hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors active:cursor-grabbing"
                          >
                            <div className={`w-8 h-8 ${block.color} rounded flex items-center justify-center mr-3 flex-shrink-0`}>
                              <block.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {block.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {block.type}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 relative">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-2 right-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Como usar:
                </h3>
                <ul className="text-xs text-green-700 dark:text-green-400 space-y-1 pr-6">
                  <li>• Arraste elementos para o canvas</li>
                  <li>• Duplo-clique para editar conteúdo</li>
                  <li>• Clique direito para menu contextual</li>
                  <li>• Use Ctrl+Z/Y para desfazer/refazer</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
