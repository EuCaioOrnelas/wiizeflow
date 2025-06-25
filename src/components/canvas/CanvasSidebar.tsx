
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface NodeCategory {
  id: string;
  name: string;
  items: NodeItem[];
}

interface NodeItem {
  type: string;
  label: string;
  icon: string;
  description: string;
}

interface CanvasSidebarProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

export const CanvasSidebar = ({ onAddNode }: CanvasSidebarProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const nodeCategories: NodeCategory[] = [
    {
      id: 'pages',
      name: 'Páginas',
      items: [
        { type: 'capture', label: 'Página de Captura', icon: '📝', description: 'Capturar leads e informações' },
        { type: 'sales', label: 'Página de Vendas', icon: '💰', description: 'Apresentar ofertas principais' },
        { type: 'upsell', label: 'Página de Upsell', icon: '⬆️', description: 'Ofertas complementares' },
        { type: 'downsell', label: 'Página de Downsell', icon: '⬇️', description: 'Ofertas alternativas' },
        { type: 'thankyou', label: 'Página de Obrigado', icon: '🙏', description: 'Agradecimento e próximos passos' },
        { type: 'checkout', label: 'Checkout', icon: '🛒', description: 'Finalização de compra' },
      ]
    },
    {
      id: 'communication',
      name: 'Comunicação',
      items: [
        { type: 'email', label: 'E-mail', icon: '📧', description: 'Campanhas de email marketing' },
        { type: 'whatsapp', label: 'WhatsApp', icon: '💬', description: 'Mensagens via WhatsApp' },
        { type: 'sms', label: 'SMS', icon: '📱', description: 'Mensagens de texto' },
        { type: 'call', label: 'Ligação', icon: '📞', description: 'Chamadas telefônicas' },
        { type: 'dminstagram', label: 'DM Instagram', icon: '📷', description: 'Mensagens diretas no Instagram' },
      ]
    },
    {
      id: 'social',
      name: 'Redes Sociais',
      items: [
        { type: 'instagram', label: 'Instagram', icon: '📸', description: 'Posts e stories' },
        { type: 'youtube', label: 'Youtube', icon: '🎥', description: 'Vídeos e conteúdo' },
        { type: 'tiktok', label: 'Tik Tok', icon: '🎵', description: 'Vídeos curtos' },
      ]
    },
    {
      id: 'ads',
      name: 'Publicidade',
      items: [
        { type: 'metaads', label: 'Meta Ads', icon: '📢', description: 'Anúncios Facebook/Instagram' },
        { type: 'googleads', label: 'Google Ads', icon: '🎯', description: 'Anúncios Google' },
      ]
    },
    {
      id: 'content',
      name: 'Conteúdo',
      items: [
        { type: 'blog', label: 'Blog', icon: '📰', description: 'Artigos e posts' },
        { type: 'googlebusiness', label: 'Google meu negócio', icon: '🏢', description: 'Perfil empresarial' },
      ]
    },
    {
      id: 'others',
      name: 'Outros Elementos',
      items: [
        { type: 'text', label: 'Anotação', icon: '📄', description: 'Notas e observações' },
        { type: 'freetext', label: 'Texto Livre', icon: '✏️', description: 'Texto editável no canvas' },
        { type: 'wait', label: 'Tempo de espera', icon: '⏰', description: 'Intervalo de tempo' },
        { type: 'other', label: 'Customizado', icon: '⚙️', description: 'Elemento personalizado' },
      ]
    }
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setDraggedItem(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Elementos do Funil
        </h2>
        
        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pages">Páginas</TabsTrigger>
            <TabsTrigger value="others">Outros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="space-y-4">
            {nodeCategories.slice(0, 4).map((category) => (
              <Card key={category.id} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.type)}
                      onDragEnd={onDragEnd}
                      className={`
                        p-3 rounded-lg border cursor-move transition-all hover:shadow-md hover:scale-105
                        bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600
                        hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20
                        ${draggedItem === item.type ? 'opacity-50' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="others" className="space-y-4">
            {nodeCategories.slice(4).map((category) => (
              <Card key={category.id} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.type)}
                      onDragEnd={onDragEnd}
                      className={`
                        p-3 rounded-lg border cursor-move transition-all hover:shadow-md hover:scale-105
                        bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600
                        hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20
                        ${draggedItem === item.type ? 'opacity-50' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Dica:</strong> Arraste e solte os elementos no canvas para criar seu funil.
          </p>
        </div>
      </div>
    </div>
  );
};
