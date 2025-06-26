
import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  MessageCircle, 
  Phone, 
  Instagram, 
  Youtube, 
  Zap,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Heart,
  CreditCard,
  MessageSquare,
  Clock,
  Edit,
  Eye,
  Settings
} from 'lucide-react';
import { CustomNodeData } from '@/types/canvas';
import { EmojiGallery } from './EmojiGallery';

interface CustomNodeProps extends NodeProps {
  data: CustomNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
  readOnly?: boolean;
}

const getNodeIcon = (type: string, customIcon?: string) => {
  if (customIcon) {
    return <span className="text-lg">{customIcon}</span>;
  }

  const iconMap: Record<string, React.ReactNode> = {
    capture: <Mail className="w-4 h-4" />,
    sales: <ShoppingCart className="w-4 h-4" />,
    upsell: <TrendingUp className="w-4 h-4" />,
    downsell: <TrendingDown className="w-4 h-4" />,
    thankyou: <Heart className="w-4 h-4" />,
    checkout: <CreditCard className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    whatsapp: <MessageCircle className="w-4 h-4" />,
    sms: <MessageSquare className="w-4 h-4" />,
    call: <Phone className="w-4 h-4" />,
    dminstagram: <MessageCircle className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    tiktok: <Zap className="w-4 h-4" />,
    metaads: <Zap className="w-4 h-4" />,
    googleads: <Zap className="w-4 h-4" />,
    blog: <Edit className="w-4 h-4" />,
    googlebusiness: <Zap className="w-4 h-4" />,
    text: <Edit className="w-4 h-4" />,
    wait: <Clock className="w-4 h-4" />,
    other: <Edit className="w-4 h-4" />,
  };

  return iconMap[type] || <Edit className="w-4 h-4" />;
};

const getNodeColor = (type: string, customColor?: string, nodeColor?: string) => {
  if (nodeColor) return nodeColor;
  if (customColor) return customColor;

  const colorMap: Record<string, string> = {
    capture: '#10b981',
    sales: '#10b981',
    upsell: '#10b981',
    downsell: '#ef4444',
    thankyou: '#8b5cf6',
    checkout: '#06b6d4',
    email: '#6366f1',
    whatsapp: '#22c55e',
    sms: '#a855f7',
    call: '#f97316',
    dminstagram: '#ec4899',
    instagram: '#f97316',
    youtube: '#dc2626',
    tiktok: '#000000',
    metaads: '#1877f2',
    googleads: '#4285f4',
    blog: '#6b7280',
    googlebusiness: '#4285f4',
    text: '#6b7280',
    wait: '#64748b',
    other: '#6b7280',
  };

  return colorMap[type] || '#10b981';
};

export const CustomNode = memo(({ 
  id, 
  data, 
  selected, 
  onUpdateNode,
  readOnly = false
}: CustomNodeProps) => {
  const [showEmojiGallery, setShowEmojiGallery] = useState(false);
  const nodeColor = getNodeColor(data.type, data.customColor, data.nodeColor);

  const handleEmojiSelect = (emoji: string) => {
    if (onUpdateNode && !readOnly) {
      onUpdateNode(id, { customIcon: emoji });
    }
    setShowEmojiGallery(false);
  };

  const handleColorChange = (color: string) => {
    if (onUpdateNode && !readOnly) {
      onUpdateNode(id, { customColor: color });
    }
  };

  return (
    <>
      <div 
        className={`bg-white border-2 rounded-lg shadow-lg min-w-[240px] max-w-[300px] transition-all duration-200 ${
          selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
        } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: nodeColor }}
              >
                {getNodeIcon(data.type, data.customIcon)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {data.label}
                </h3>
                <p className="text-xs text-gray-500 capitalize">{data.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {!readOnly && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                  onClick={() => setShowEmojiGallery(true)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content indicator */}
        {data.hasContent && (
          <div className="px-4 py-2">
            <Badge variant="secondary" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Conteúdo
            </Badge>
          </div>
        )}
      </div>

      {/* Handles para conexões */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ bottom: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ right: -6 }}
      />

      {/* Emoji Gallery */}
      {showEmojiGallery && !readOnly && (
        <EmojiGallery
          isOpen={showEmojiGallery}
          onClose={() => setShowEmojiGallery(false)}
          onEmojiSelect={handleEmojiSelect}
        />
      )}
    </>
  );
});

CustomNode.displayName = 'CustomNode';
