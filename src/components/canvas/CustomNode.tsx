
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
  Eye
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
    return <span className="text-2xl">{customIcon}</span>;
  }

  const iconMap: Record<string, React.ReactNode> = {
    capture: <Mail className="w-6 h-6" />,
    sales: <ShoppingCart className="w-6 h-6" />,
    upsell: <TrendingUp className="w-6 h-6" />,
    downsell: <TrendingDown className="w-6 h-6" />,
    thankyou: <Heart className="w-6 h-6" />,
    checkout: <CreditCard className="w-6 h-6" />,
    email: <Mail className="w-6 h-6" />,
    whatsapp: <MessageCircle className="w-6 h-6" />,
    sms: <MessageSquare className="w-6 h-6" />,
    call: <Phone className="w-6 h-6" />,
    dminstagram: <MessageCircle className="w-6 h-6" />,
    instagram: <Instagram className="w-6 h-6" />,
    youtube: <Youtube className="w-6 h-6" />,
    tiktok: <Zap className="w-6 h-6" />,
    metaads: <Zap className="w-6 h-6" />,
    googleads: <Zap className="w-6 h-6" />,
    blog: <Edit className="w-6 h-6" />,
    googlebusiness: <Zap className="w-6 h-6" />,
    text: <Edit className="w-6 h-6" />,
    wait: <Clock className="w-6 h-6" />,
    other: <Edit className="w-6 h-6" />,
  };

  return iconMap[type] || <Edit className="w-6 h-6" />;
};

const getNodeColor = (type: string, customColor?: string, nodeColor?: string) => {
  if (nodeColor) return nodeColor;
  if (customColor) return customColor;

  const colorMap: Record<string, string> = {
    capture: '#3b82f6',
    sales: '#10b981',
    upsell: '#f59e0b',
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

  return colorMap[type] || '#6b7280';
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

  const handleNodeColorChange = (color: string) => {
    if (onUpdateNode && !readOnly) {
      onUpdateNode(id, { nodeColor: color });
    }
  };

  return (
    <>
      <Card 
        className={`min-w-[200px] max-w-[300px] shadow-lg border-2 transition-all duration-200 ${
          selected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
        } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        style={{
          backgroundColor: nodeColor + '15',
          borderColor: selected ? '#3b82f6' : nodeColor + '50'
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="p-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: nodeColor, color: 'white' }}
              >
                {getNodeIcon(data.type, data.customIcon)}
              </div>
              <div className="flex-1">
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {data.label}
                </CardTitle>
                <p className="text-xs text-gray-500 capitalize">{data.type}</p>
              </div>
            </div>
            
            {data.hasContent && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Conteúdo
              </Badge>
            )}
          </div>
        </CardHeader>

        {!readOnly && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-6 px-2"
                onClick={() => setShowEmojiGallery(true)}
              >
                🎭 Ícone
              </Button>
              
              <div className="flex space-x-1">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                  <button
                    key={color}
                    className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        )}

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
      </Card>

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
