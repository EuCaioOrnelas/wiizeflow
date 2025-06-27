
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Layout, 
  Users, 
  Target, 
  Download, 
  Crown,
  Lock,
  Save,
  Upload,
  FileDown,
  Trash2,
  Plus
} from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTemplateOperations } from '@/hooks/useTemplateOperations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
  icon: React.ReactNode;
  createdAt?: string;
}

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (nodes: Node[], edges: Edge[]) => void;
  onSaveTemplate: () => { nodes: Node[]; edges: Edge[] };
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ 
  isOpen, 
  onClose, 
  onLoadTemplate, 
  onSaveTemplate 
}) => {
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'predefined' | 'custom'>('predefined');
  const { toast } = useToast();
  const { saveTemplate, loadTemplates, deleteTemplate, exportTemplate, importTemplate } = useTemplateOperations();

  React.useEffect(() => {
    checkUserPlan();
    loadUserTemplates();
  }, [isOpen]);

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

  const loadUserTemplates = () => {
    const templates = loadTemplates();
    setUserTemplates(templates);
  };

  const predefinedTemplates: Template[] = [
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

  const handleSaveTemplate = async () => {
    if (userPlan === 'free') {
      toast({
        title: "Recurso Premium",
        description: "Salvar templates é exclusivo para usuários dos planos Mensal e Anual.",
        variant: "destructive",
      });
      return;
    }

    if (!templateName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, digite um nome para o template.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvasData = onSaveTemplate();
      if (!canvasData.nodes.length) {
        toast({
          title: "Canvas vazio",
          description: "Adicione alguns blocos ao canvas antes de salvar como template.",
          variant: "destructive",
        });
        return;
      }

      saveTemplate(templateName, templateDescription, canvasData.nodes, canvasData.edges);
      setTemplateName('');
      setTemplateDescription('');
      setShowSaveDialog(false);
      loadUserTemplates();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar template.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    loadUserTemplates();
  };

  const handleExportTemplate = (template: Template) => {
    exportTemplate(template);
  };

  const handleImportTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (userPlan === 'free') {
      toast({
        title: "Recurso Premium",
        description: "Importar templates é exclusivo para usuários dos planos Mensal e Anual.",
        variant: "destructive",
      });
      return;
    }

    try {
      await importTemplate(file);
      loadUserTemplates();
    } catch (error) {
      // Error handling is done in the hook
    }
    
    // Reset the input
    event.target.value = '';
  };

  const isPremiumFeature = userPlan === 'free';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Templates</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
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

            {/* Tabs */}
            <div className="flex space-x-4 border-b">
              <button
                onClick={() => setActiveTab('predefined')}
                className={`pb-2 px-4 font-medium ${
                  activeTab === 'predefined'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Templates Predefinidos
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`pb-2 px-4 font-medium ${
                  activeTab === 'custom'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled={isPremiumFeature}
              >
                Meus Templates
                {isPremiumFeature && <Lock className="w-3 h-3 ml-1 inline" />}
              </button>
            </div>

            {/* Custom Templates Actions */}
            {activeTab === 'custom' && !isPremiumFeature && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  variant="outline"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Template Atual
                </Button>
                
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Template
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportTemplate}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === 'predefined' && predefinedTemplates.map((template) => (
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

              {activeTab === 'custom' && !isPremiumFeature && userTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{template.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportTemplate(template)}
                          className="p-1 h-6 w-6"
                        >
                          <FileDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm">{template.description || 'Sem descrição'}</p>
                    {template.createdAt && (
                      <p className="text-xs text-gray-500 mb-4">
                        Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    <Button
                      onClick={() => handleLoadTemplate(template)}
                      disabled={loading}
                      size="sm"
                      className="w-full"
                    >
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {activeTab === 'custom' && !isPremiumFeature && userTemplates.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Save className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Nenhum template personalizado
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Salve seus funis como templates para reutilizá-los rapidamente
                  </p>
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Salvar Primeiro Template
                  </Button>
                </div>
              )}
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
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Digite um nome para o template"
              />
            </div>
            <div>
              <Label htmlFor="template-description">Descrição (opcional)</Label>
              <Textarea
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Descreva para que serve este template"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateManager;
