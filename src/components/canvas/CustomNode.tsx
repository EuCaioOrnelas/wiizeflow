import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EmojiGallery } from './EmojiGallery';
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
  Phone
} from 'lucide-react';

interface CustomNodeComponentProps extends NodeProps {
  data: CustomNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
  onOpenEditor?: (nodeId: string) => void;
}

// Cores predefinidas para o background do ícone
const iconBackgroundColors = [
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Verde', value: 'bg-green-500' },
  { name: 'Vermelho', value: 'bg-red-500' },
  { name: 'Amarelo', value: 'bg-yellow-500' },
  { name: 'Roxo', value: 'bg-purple-500' },
  { name: 'Rosa', value: 'bg-pink-500' },
  { name: 'Laranja', value: 'bg-orange-500' },
  { name: 'Índigo', value: 'bg-indigo-500' },
  { name: 'Cinza', value: 'bg-gray-500' },
  { name: 'Esmeralda', value: 'bg-emerald-500' },
  { name: 'Ciano', value: 'bg-cyan-500' },
  { name: 'Âmbar', value: 'bg-amber-500' }
];

export const CustomNode = memo(({ id, data, selected, onUpdateNode }: CustomNodeComponentProps) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showEmojiGallery, setShowEmojiGallery] = useState(false);
  const [tempName, setTempName] = useState(data.label);
  const customizerRef = useRef<HTMLDivElement>(null);

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
      case 'text':
        return <FileText className="w-4 h-4 text-white" />;
      case 'wait':
        return <Clock className="w-4 h-4 text-white" />;
      case 'other':
        if (data.customIcon) {
          return <span className="text-white text-sm">{data.customIcon}</span>;
        }
        return <Plus className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  const getIconBackgroundColor = (type: string) => {
    // Para elementos customizados, usar a cor customizada se disponível
    if (type === 'other' && data.customColor) {
      return data.customColor;
    }

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
      case 'text':
        return 'bg-indigo-500';
      case 'wait':
        return 'bg-amber-500';
      case 'other':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (onUpdateNode) {
      onUpdateNode(id, { customIcon: emoji });
    }
    setShowEmojiGallery(false);
  };

  const handleColorSelect = (color: string) => {
    if (onUpdateNode) {
      onUpdateNode(id, { customColor: color });
    }
  };

  const handleNameSave = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onUpdateNode && tempName.trim() && tempName.trim() !== data.label) {
      onUpdateNode(id, { label: tempName.trim() });
    }
    setShowCustomizer(false);
  };

  const handleOpenEditor = (e: React.MouseEvent) => {
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

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (data.type === 'other') {
      setShowEmojiGallery(true);
    }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTempName(data.label);
    setShowCustomizer(!showCustomizer);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setTempName(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setTempName(data.label);
      setShowCustomizer(false);
    }
  };

  const handleEmojiButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowEmojiGallery(true);
    setShowCustomizer(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleNameSave(e);
  };

  // Verificar se há conteúdo real usando a estrutura correta do NodeContent
  const hasRealContent = data.content && (
    (data.content.title && data.content.title.trim() !== '') ||
    (data.content.description && data.content.description.trim() !== '') ||
    (data.content.items && data.content.items.length > 0 && 
     data.content.items.some(item => item.content && item.content.trim() !== ''))
  );

  const selectedClass = selected ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg' : '';
  const iconBgClass = getIconBackgroundColor(data.type);

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
          px-5 py-4 rounded-lg border-2 shadow-md min-w-[304px] max-w-[512px]
          bg-white border-gray-300 text-gray-800 ${selectedClass}
          transition-all duration-200 hover:shadow-lg
        `}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 flex-1">
            <div 
              className={`w-6 h-6 ${iconBgClass} rounded flex items-center justify-center flex-shrink-0 ${
                data.type === 'other' ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
              }`}
              onClick={handleIconClick}
            >
              {getNodeIcon(data.type)}
            </div>
            <span className="font-medium text-sm select-none">
              {data.label}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Botão de edição */}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-200 opacity-70 hover:opacity-100"
              onClick={handleOpenEditor}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            
            {/* Configurações */}
            <Popover open={showCustomizer} onOpenChange={(open) => {
              if (!open) {
                setTempName(data.label);
              }
              setShowCustomizer(open);
            }}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-gray-200 opacity-70 hover:opacity-100"
                  onClick={handleSettingsClick}
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 p-4" 
                side="top" 
                align="end"
                ref={customizerRef}
                onPointerDownOutside={(e) => {
                  // Permitir cliques dentro do emoji gallery
                  if (showEmojiGallery) {
                    e.preventDefault();
                  }
                }}
              >
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Campo para editar o nome */}
                  <div>
                    <Label htmlFor="element-name" className="text-sm font-medium">Nome do Elemento</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="element-name"
                        value={tempName}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        className="flex-1"
                        placeholder="Nome do elemento"
                      />
                      <Button type="submit" size="sm">
                        Salvar
                      </Button>
                    </div>
                  </div>

                  {/* Configurações especiais para elemento customizado */}
                  {data.type === 'other' && (
                    <>
                      {/* Botão para abrir galeria de emojis */}
                      <div>
                        <Label className="text-sm font-medium">Ícone do Elemento</Label>
                        <Button
                          type="button"
                          onClick={handleEmojiButtonClick}
                          variant="outline"
                          className="w-full mt-1 flex items-center justify-center space-x-2"
                        >
                          <span className="text-lg">{data.customIcon || '📝'}</span>
                          <span>Alterar Ícone</span>
                        </Button>
                      </div>

                      {/* Seletor de cor do background do ícone */}
                      <div>
                        <Label className="text-sm font-medium">Cor do Fundo do Ícone</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {iconBackgroundColors.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleColorSelect(color.value);
                              }}
                              className={`w-8 h-8 rounded ${color.value} border-2 transition-all ${
                                data.customColor === color.value 
                                  ? 'border-gray-800 scale-110' 
                                  : 'border-gray-300 hover:border-gray-500'
                              }`}
                              title={color.name}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Cor atual: {iconBackgroundColors.find(c => c.value === data.customColor)?.name || 'Padrão'}
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </PopoverContent>
            </Popover>
          </div>
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
           data.type === 'text' ? 'Anotação' :
           data.type === 'wait' ? 'Tempo de espera' :
           data.type === 'other' ? 'Customizado' : data.type}
        </div>

        {hasRealContent && (
          <div className="text-xs bg-gray-100 rounded p-1 mt-2">
            {data.content && data.content.title && (
              <div className="font-medium truncate">{data.content.title}</div>
            )}
          </div>
        )}
      </div>

      {/* Galeria de Emojis - exclusiva para elementos customizados */}
      {data.type === 'other' && (
        <EmojiGallery
          isOpen={showEmojiGallery}
          onClose={() => setShowEmojiGallery(false)}
          onEmojiSelect={handleEmojiSelect}
          currentEmoji={data.customIcon}
        />
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
