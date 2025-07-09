import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Target, 
  MousePointer, 
  Mail, 
  MessageCircle, 
  ShoppingCart, 
  Heart,
  FileText,
  Plus,
  Settings,
  Edit3,
  TrendingUp,
  TrendingDown,
  Instagram,
  Youtube,
  Play,
  Megaphone,
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
  XCircle
} from 'lucide-react';

interface CustomNodeComponentProps extends NodeProps {
  data: CustomNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
  onOpenEditor?: (nodeId: string) => void;
  isReadOnly?: boolean;
}

export const CustomNode = memo(({ id, data, selected, onUpdateNode, isReadOnly = false }: CustomNodeComponentProps) => {
  const [showContentPopup, setShowContentPopup] = useState(false);
  const isMobile = useIsMobile();

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'capture':
        return <MousePointer className="w-4 h-4 text-white" />;
      case 'sales':
        return <Target className="w-4 h-4 text-white" />;
      case 'upsell':
        return <TrendingUp className="w-4 h-4 text-white" />;
      case 'downsell':
        return <TrendingDown className="w-4 h-4 text-white" />;
      case 'thankyou':
        return <Heart className="w-4 h-4 text-white" />;
      case 'checkout':
        return <ShoppingCart className="w-4 h-4 text-white" />;
      case 'email':
        return <Mail className="w-4 h-4 text-white" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-white" />;
      case 'sms':
        return <MessageCircle className="w-4 h-4 text-white" />;
      case 'call':
        return <Phone className="w-4 h-4 text-white" />;
      case 'dminstagram':
        return <Instagram className="w-4 h-4 text-white" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-white" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-white" />;
      case 'tiktok':
        return <Play className="w-4 h-4 text-white" />;
      case 'metaads':
        return <Megaphone className="w-4 h-4 text-white" />;
      case 'googleads':
        return <Target className="w-4 h-4 text-white" />;
      case 'blog':
        return <FileText className="w-4 h-4 text-white" />;
      case 'googlebusiness':
        return <Building2 className="w-4 h-4 text-white" />;
      case 'prospeccao':
        return <Users className="w-4 h-4 text-white" />;
      case 'conversapresencial':
        return <Handshake className="w-4 h-4 text-white" />;
      case 'indicacao':
        return <UserPlus className="w-4 h-4 text-white" />;
      case 'text':
        return <FileText className="w-4 h-4 text-white" />;
      case 'wait':
        return <Clock className="w-4 h-4 text-white" />;
      case 'formulario':
        return <ClipboardList className="w-4 h-4 text-white" />;
      case 'listacontatos':
        return <UserCheck className="w-4 h-4 text-white" />;
      case 'vendafechada':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'vendaperdida':
        return <XCircle className="w-4 h-4 text-white" />;
      case 'other':
        return <Plus className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  const getIconBackgroundColor = (type: string) => {
    switch (type) {
      case 'capture':
        return 'bg-blue-500';
      case 'sales':
        return 'bg-green-500';
      case 'upsell':
        return 'bg-emerald-500';
      case 'downsell':
        return 'bg-orange-500';
      case 'thankyou':
        return 'bg-purple-500';
      case 'checkout':
        return 'bg-red-500';
      case 'email':
        return 'bg-yellow-500';
      case 'whatsapp':
        return 'bg-green-600';
      case 'sms':
        return 'bg-blue-400';
      case 'call':
        return 'bg-indigo-500';
      case 'dminstagram':
        return 'bg-pink-400';
      case 'instagram':
        return 'bg-pink-500';
      case 'youtube':
        return 'bg-red-600';
      case 'tiktok':
        return 'bg-black';
      case 'metaads':
        return 'bg-blue-600';
      case 'googleads':
        return 'bg-yellow-500';
      case 'blog':
        return 'bg-slate-600';
      case 'googlebusiness':
        return 'bg-green-600';
      case 'prospeccao':
        return 'bg-teal-500';
      case 'conversapresencial':
        return 'bg-amber-600';
      case 'indicacao':
        return 'bg-cyan-500';
      case 'text':
        return 'bg-indigo-500';
      case 'wait':
        return 'bg-amber-500';
      case 'formulario':
        return 'bg-violet-500';
      case 'listacontatos':
        return 'bg-blue-700';
      case 'vendafechada':
        return 'bg-green-700';
      case 'vendaperdida':
        return 'bg-red-700';
      case 'other':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleOpenEditor = (e: React.MouseEvent) => {
    // No modo read-only, não deve abrir o editor
    if (isReadOnly) {
      return;
    }
    
    e.stopPropagation();
    e.preventDefault();
    
    // Trigger double click event to open content editor
    const event = new MouseEvent('dblclick', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    e.currentTarget.parentElement?.dispatchEvent(event);
  };

  // Novo handler para abrir o editor lateral ao clicar na engrenagem
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Trigger node click to select it and open sidebar editor
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    e.currentTarget.parentElement?.dispatchEvent(event);
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    // Verificar se o clique foi em um botão de ação
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // No modo read-only, abrir popup se tiver conteúdo
    if (isReadOnly && hasRealContent) {
      e.stopPropagation();
      setShowContentPopup(true);
    }
  };

  const hasRealContent = data.content && (
    (data.content.title && data.content.title.trim() !== '') ||
    (data.content.description && data.content.description.trim() !== '') ||
    (data.content.items && data.content.items.length > 0 && 
     data.content.items.some((item: any) => {
       if (item.content && item.content.trim() !== '') return true;
       if (item.items && item.items.length > 0) return true;
       return false;
     }))
  );

  const selectedClass = selected ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg' : '';
  const iconBgClass = getIconBackgroundColor(data.type);

  // Responsive sizing
  const nodeWidth = isMobile ? 'min-w-[280px] max-w-[320px]' : 'min-w-[304px] max-w-[512px]';
  const nodePadding = isMobile ? 'px-3 py-3' : 'px-5 py-4';

  return (
    <div className={`relative ${selectedClass}`}>
      {/* Handles nas 4 direções */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ top: -3 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ top: -3 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ left: -3 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ left: -3 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ right: -3 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ right: -3 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ bottom: -3 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ bottom: -3 }}
      />
      
      <div 
        className={`
          ${nodePadding} rounded-lg border-2 shadow-md ${nodeWidth}
          bg-white border-gray-300 text-gray-800 ${selectedClass}
          transition-all duration-200 hover:shadow-lg
          ${isReadOnly && hasRealContent ? 'cursor-pointer' : ''}
        `}
        onClick={handleNodeClick}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div 
              className={`w-5 h-5 md:w-6 md:h-6 ${iconBgClass} rounded flex items-center justify-center flex-shrink-0`}
            >
              {getNodeIcon(data.type)}
            </div>
            <span className="font-medium text-xs md:text-sm select-none truncate">
              {data.label}
            </span>
          </div>
          
          {/* Só mostra os botões de edição se não estiver em modo somente leitura */}
          {!isReadOnly && (
            <div className="flex items-center space-x-1 flex-shrink-0">
              {/* Botão de edição */}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-gray-200 opacity-70 hover:opacity-100"
                onClick={handleOpenEditor}
              >
                <Edit3 className="w-2.5 h-2.5 md:w-3 md:h-3" />
              </Button>
              
              {/* Botão de configurações - agora abre o editor lateral */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 md:h-6 md:w-6 p-0 hover:bg-gray-200 opacity-70 hover:opacity-100"
                onClick={handleSettingsClick}
              >
                <Settings className="w-2.5 h-2.5 md:w-3 md:h-3" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-xs opacity-75 capitalize mb-2">
          {data.type === 'capture' ? 'Captura' : 
           data.type === 'sales' ? 'Vendas' :
           data.type === 'upsell' ? 'Upsell' :
           data.type === 'downsell' ? 'Downsell' :
           data.type === 'thankyou' ? 'Obrigado' :
           data.type === 'checkout' ? 'Checkout' :
           data.type === 'email' ? 'E-mail' :
           data.type === 'whatsapp' ? 'WhatsApp' :
           data.type === 'sms' ? 'SMS' :
           data.type === 'call' ? 'Ligação' :
           data.type === 'dminstagram' ? 'DM Instagram' :
           data.type === 'instagram' ? 'Instagram' :
           data.type === 'youtube' ? 'Youtube' :
           data.type === 'tiktok' ? 'Tik Tok' :
           data.type === 'metaads' ? 'Meta Ads' :
           data.type === 'googleads' ? 'Google Ads' :
           data.type === 'blog' ? 'Blog' :
           data.type === 'googlebusiness' ? 'Google meu negócio' :
           data.type === 'prospeccao' ? 'Prospecção' :
           data.type === 'conversapresencial' ? 'Conversa Presencial' :
           data.type === 'indicacao' ? 'Indicação' :
           data.type === 'text' ? 'Anotação' :
           data.type === 'wait' ? 'Tempo de espera' :
           data.type === 'formulario' ? 'Formulário' :
           data.type === 'listacontatos' ? 'Lista de Contatos' :
           data.type === 'vendafechada' ? 'Venda Fechada' :
           data.type === 'vendaperdida' ? 'Venda Perdida' :
           data.type === 'other' ? 'Customizado' : data.type}
        </div>

        {hasRealContent && (
          <div className="text-xs bg-gray-100 rounded p-1 mt-2">
            {data.content && data.content.title && (
              <div className="font-medium truncate text-xs">{data.content.title}</div>
            )}
            {isReadOnly && (
              <div className="text-xs text-gray-500 mt-1">Clique para ver mais detalhes</div>
            )}
          </div>
        )}
      </div>

      {/* Dialog de conteúdo para modo somente leitura - centralizado e maior */}
      {isReadOnly && (
        <Dialog open={showContentPopup} onOpenChange={setShowContentPopup}>
          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'w-[80vw] max-w-2xl'} max-h-[80vh] overflow-hidden`}>
            <DialogHeader className="pb-4">
              <DialogTitle className="flex items-center space-x-2 text-sm md:text-base">
                <div className={`w-4 h-4 md:w-5 md:h-5 ${iconBgClass} rounded flex items-center justify-center flex-shrink-0`}>
                  {getNodeIcon(data.type)}
                </div>
                <span className="truncate">{data.label}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
              {data.content && (
                <>
                  {data.content.title && (
                    <div>
                      <h4 className="font-medium text-sm md:text-base text-gray-700 mb-1">Título:</h4>
                      <p className="text-sm md:text-base text-gray-600 break-words bg-gray-50 p-3 rounded">{data.content.title}</p>
                    </div>
                  )}
                  
                  {data.content.description && (
                    <div>
                      <h4 className="font-medium text-sm md:text-base text-gray-700 mb-1">Descrição:</h4>
                      <p className="text-sm md:text-base text-gray-600 break-words bg-gray-50 p-3 rounded whitespace-pre-wrap">{data.content.description}</p>
                    </div>
                  )}
                  
                  {data.content.items && data.content.items.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm md:text-base text-gray-700 mb-2">Conteúdo Adicional:</h4>
                      <div className="space-y-2">
                        {data.content.items.map((item: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            {item.content && item.content.trim() !== '' && (
                              <p className="text-sm md:text-base text-gray-600 break-words whitespace-pre-wrap">
                                {item.content}
                              </p>
                            )}
                            {item.items && item.items.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {item.items.map((listItem: any, listIndex: number) => (
                                  <li key={listIndex} className="flex items-center space-x-2">
                                    {item.type === 'checklist' && (
                                      <input 
                                        type="checkbox" 
                                        checked={listItem.checked || false} 
                                        readOnly 
                                        className="rounded border-gray-300"
                                      />
                                    )}
                                    <span className="text-sm text-gray-600">{listItem.text}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setShowContentPopup(false)} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
