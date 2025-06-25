
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layout, 
  Users, 
  Target, 
  Download, 
  Crown,
  Lock
} from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
  icon: React.ReactNode;
}

interface TemplateManagerProps {
  onLoadTemplate: (nodes: Node[], edges: Edge[]) => void;
  onClose: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ onLoadTemplate, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');
  const { toast } = useToast();

  React.useEffect(() => {
    checkUserPlan();
  }, []);

  const checkUserPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan_type')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profile) {
          setUserPlan(profile.plan_type || 'free');
        }
      }
    } catch (error) {
      console.error('Error checking user plan:', error);
    }
  };

  const templates: Template[] = [
    {
      id: 'sales-funnel',
      name: 'Funil de Vendas Básico',
      description: 'Template para captura de leads e conversão',
      category: 'Vendas',
      icon: <Target className="w-6 h-6" />,
      nodes: [
        {
          id: 'landing',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: { 
            name: 'Página de Captura',
            icon: 'Layout',
            content: {
              title: 'Oferta Especial',
              description: 'Descubra como aumentar suas vendas',
              items: []
            }
          }
        },
        {
          id: 'thanks',
          type: 'custom', 
          position: { x: 100, y: 300 },
          data: {
            name: 'Página de Obrigado',
            icon: 'Users',
            content: {
              title: 'Obrigado!',
              description: 'Verifique seu email',
              items: []
            }
          }
        }
      ],
      edges: [
        {
          id: 'landing-thanks',
          source: 'landing',
          target: 'thanks',
          type: 'smoothstep'
        }
      ]
    },
    {
      id: 'lead-magnet',
      name: 'Funil Lead Magnet',
      description: 'Captura de leads com material gratuito',
      category: 'Marketing',
      icon: <Download className="w-6 h-6" />,
      nodes: [
        {
          id: 'opt-in',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            name: 'Opt-in',
            icon: 'Download',
            content: {
              title: 'Material Gratuito',
              description: 'Baixe nosso guia exclusivo',
              items: []
            }
          }
        },
        {
          id: 'delivery',
          type: 'custom',
          position: { x: 100, y: 300 },
          data: {
            name: 'Entrega',
            icon: 'Layout',
            content: {
              title: 'Download',
              description: 'Seu material está pronto',
              items: []
            }
          }
        }
      ],
      edges: [
        {
          id: 'opt-delivery',
          source: 'opt-in',
          target: 'delivery',
          type: 'smoothstep'
        }
      ]
    }
  ];

  const handleLoadTemplate = async (template: Template) => {
    if (userPlan === 'free') {
      toast({
        title: "Recurso Premium",
        description: "Templates são exclusivos para usuários dos planos Mensal e Anual. Faça upgrade para acessar!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      onLoadTemplate(template.nodes, template.edges);
      onClose();
      toast({
        title: "Template carregado",
        description: `O template "${template.name}" foi aplicado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar template. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isPremiumFeature = userPlan === 'free';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Templates de Funis</h2>
        <p className="text-gray-600">
          Acelere a criação dos seus funis com templates profissionais
        </p>
        {isPremiumFeature && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                Templates são exclusivos para planos Mensal e Anual
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={`relative ${isPremiumFeature ? 'opacity-75' : ''}`}>
            {isPremiumFeature && (
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Lock className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {template.icon}
                <span>{template.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{template.category}</Badge>
                <Button
                  onClick={() => handleLoadTemplate(template)}
                  disabled={loading || isPremiumFeature}
                  size="sm"
                >
                  {isPremiumFeature ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Restrito
                    </>
                  ) : (
                    'Usar Template'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isPremiumFeature && (
        <div className="text-center">
          <Button
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Crown className="w-4 h-4 mr-2" />
            Fazer Upgrade Agora
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
