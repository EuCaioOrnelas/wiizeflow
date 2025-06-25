
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
  X
} from 'lucide-react';

const blockCategories = [
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
      { type: 'text', name: 'Anotação', icon: FileText, color: 'bg-indigo-500' },
      { type: 'wait', name: 'Tempo de espera', icon: Clock, color: 'bg-amber-500' },
      { type: 'other', name: 'Customizado', icon: Plus, color: 'bg-gray-500' },
    ]
  }
];

interface CanvasSidebarProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

export const CanvasSidebar = ({ onAddNode }: CanvasSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Páginas': true,
    'Tráfego': true,
    'Comunicação': true,
    'Outros': true,
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

  const filteredCategories = blockCategories.map(category => ({
    ...category,
    blocks: category.blocks.filter(block => 
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.blocks.length > 0);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Elementos
        </h2>
        
        {/* Search */}
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
                  {category.blocks.map((block) => (
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
                  ))}
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
    </div>
  );
};
