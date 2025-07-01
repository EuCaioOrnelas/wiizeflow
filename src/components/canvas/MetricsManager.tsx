
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Node } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { NodeMetric, MetricCategory, CalculationType, CalculationConfig } from '@/types/metrics';

interface MetricsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node<CustomNodeData>;
  funnelId: string;
  allNodes: Node<CustomNodeData>[];
}

const METRIC_CATEGORIES = [
  { value: 'visitantes_unicos', label: 'Visitantes únicos' },
  { value: 'cliques', label: 'Cliques' },
  { value: 'lead_capturado', label: 'Lead Capturado' },
  { value: 'oportunidades', label: 'Oportunidades' },
  { value: 'vendas_realizadas', label: 'Vendas Realizadas' },
  { value: 'pos_venda', label: 'Pós-venda' },
];

const CALCULATION_CONFIGS: CalculationConfig[] = [
  {
    type: 'taxa_conversao',
    name: 'Taxa de Conversão',
    description: 'Conversão entre duas etapas do funil',
    formula: '(Etapa seguinte ÷ Etapa atual) × 100',
    explanation: 'Divida o número da próxima etapa pelo número da etapa anterior. Exemplo: 10 vendas ÷ 100 cliques × 100 = 10%'
  },
  {
    type: 'taxa_qualificacao_leads',
    name: 'Taxa de Qualificação de Leads',
    description: 'Porcentagem de leads qualificados',
    formula: '(MQLs ÷ Total de Leads) × 100',
    explanation: 'Divida o número de leads qualificados pelo total de leads capturados.'
  },
  {
    type: 'taxa_oportunidades_mql',
    name: 'Taxa de Oportunidades por MQL',
    description: 'Conversão de MQLs em oportunidades',
    formula: '(Oportunidades ÷ MQLs) × 100',
    explanation: 'Divida o número de oportunidades pelo número de MQLs gerados.'
  },
  {
    type: 'taxa_fechamento',
    name: 'Taxa de Fechamento (Win Rate)',
    description: 'Porcentagem de oportunidades fechadas',
    formula: '(Vendas ÷ Oportunidades) × 100',
    explanation: 'Divida o número de vendas pelo número de oportunidades criadas.'
  },
  {
    type: 'taxa_churn',
    name: 'Taxa de Churn',
    description: 'Porcentagem de clientes perdidos',
    formula: '(Clientes perdidos ÷ Total de clientes) × 100',
    explanation: 'Divida o número de clientes perdidos pelo total de clientes no período.'
  },
  {
    type: 'taxa_retencao',
    name: 'Taxa de Retenção',
    description: 'Porcentagem de clientes mantidos',
    formula: '(Clientes mantidos ÷ Total de clientes) × 100',
    explanation: 'Divida o número de clientes mantidos pelo total de clientes no início do período.'
  },
  {
    type: 'taxa_recompra',
    name: 'Taxa de Recompra',
    description: 'Porcentagem de clientes que compraram novamente',
    formula: '(Clientes recompra ÷ Total de clientes) × 100',
    explanation: 'Divida o número de clientes que compraram mais de uma vez pelo total de clientes.'
  },
  {
    type: 'taxa_resposta_vendas',
    name: 'Taxa de Resposta de Vendas',
    description: 'Porcentagem de leads contatados',
    formula: '(Leads contatados ÷ Total de leads) × 100',
    explanation: 'Divida o número de leads contatados pelo total de leads disponíveis.'
  },
  {
    type: 'taxa_follow_up',
    name: 'Taxa de Follow-Up',
    description: 'Porcentagem de leads com acompanhamento',
    formula: '(Leads com follow-up ÷ Leads abordados) × 100',
    explanation: 'Divida o número de leads com mais de 1 contato pelos leads inicialmente abordados.'
  }
];

export const MetricsManager = ({ isOpen, onClose, node, funnelId, allNodes }: MetricsManagerProps) => {
  const [metrics, setMetrics] = useState<NodeMetric[]>([]);
  const [newMetric, setNewMetric] = useState({
    value: '',
    category: '' as MetricCategory | '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [calculation, setCalculation] = useState({
    type: '' as CalculationType | '',
    sourceNodeId: '',
    targetNodeId: '',
    result: null as number | null
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadMetrics();
    }
  }, [isOpen, node.id]);

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('node_metrics')
        .select('*')
        .eq('node_id', node.id)
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const saveMetric = async () => {
    if (!newMetric.value || !newMetric.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('node_metrics')
        .insert({
          funnel_id: funnelId,
          node_id: node.id,
          user_id: session.user.id,
          metric_value: parseFloat(newMetric.value),
          metric_category: newMetric.category,
          metric_date: newMetric.date,
          notes: newMetric.notes || null
        });

      if (error) throw error;

      setNewMetric({
        value: '',
        category: '' as MetricCategory | '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      await loadMetrics();
      toast({
        title: "Sucesso",
        description: "Métrica salva com sucesso!"
      });
    } catch (error) {
      console.error('Error saving metric:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar métrica.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = async () => {
    if (!calculation.type || !calculation.sourceNodeId || !calculation.targetNodeId) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de cálculo e os dois nós para comparação.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Buscar métricas dos nós selecionados
      const { data: sourceMetrics, error: sourceError } = await supabase
        .from('node_metrics')
        .select('*')
        .eq('node_id', calculation.sourceNodeId)
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: targetMetrics, error: targetError } = await supabase
        .from('node_metrics')
        .select('*')
        .eq('node_id', calculation.targetNodeId)
        .eq('funnel_id', funnelId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (sourceError || targetError) throw sourceError || targetError;

      if (!sourceMetrics?.length || !targetMetrics?.length) {
        toast({
          title: "Erro",
          description: "Os nós selecionados devem ter métricas cadastradas.",
          variant: "destructive"
        });
        return;
      }

      const sourceValue = sourceMetrics[0].metric_value;
      const targetValue = targetMetrics[0].metric_value;
      const result = (targetValue / sourceValue) * 100;

      setCalculation(prev => ({ ...prev, result: Math.round(result * 100) / 100 }));

      // Salvar o cálculo no banco
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Usuário não autenticado');

      await supabase
        .from('node_metrics')
        .insert({
          funnel_id: funnelId,
          node_id: node.id,
          user_id: session.user.id,
          metric_value: result,
          metric_category: 'pos_venda', // Categoria padrão para cálculos
          metric_date: new Date().toISOString().split('T')[0],
          calculation_type: calculation.type,
          calculation_result: result,
          source_node_id: calculation.sourceNodeId,
          target_node_id: calculation.targetNodeId,
          notes: `Cálculo automático: ${CALCULATION_CONFIGS.find(c => c.type === calculation.type)?.name}`
        });

      await loadMetrics();
      toast({
        title: "Cálculo realizado!",
        description: `Resultado: ${result.toFixed(2)}%`
      });
    } catch (error) {
      console.error('Error calculating percentage:', error);
      toast({
        title: "Erro",
        description: "Erro ao calcular porcentagem.",
        variant: "destructive"
      });
    }
  };

  const deleteMetric = async (metricId: string) => {
    try {
      const { error } = await supabase
        .from('node_metrics')
        .delete()
        .eq('id', metricId);

      if (error) throw error;
      await loadMetrics();
      toast({
        title: "Sucesso",
        description: "Métrica removida com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting metric:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover métrica.",
        variant: "destructive"
      });
    }
  };

  const selectedCalculationConfig = CALCULATION_CONFIGS.find(c => c.type === calculation.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Métricas - {node.data.label}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="calculations">Cálculos</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nova Métrica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metric-value">Valor da Métrica *</Label>
                    <Input
                      id="metric-value"
                      type="number"
                      value={newMetric.value}
                      onChange={(e) => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Ex: 150"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metric-category">Categoria *</Label>
                    <Select
                      value={newMetric.category}
                      onValueChange={(value: MetricCategory) => setNewMetric(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {METRIC_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="metric-date">Data da Métrica</Label>
                  <Input
                    id="metric-date"
                    type="date"
                    value={newMetric.date}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="metric-notes">Observações</Label>
                  <Textarea
                    id="metric-notes"
                    value={newMetric.notes}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observações opcionais..."
                  />
                </div>

                <Button onClick={saveMetric} disabled={loading} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Métrica
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma métrica cadastrada</p>
                ) : (
                  <div className="space-y-2">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{metric.metric_value}</p>
                          <p className="text-sm text-gray-600">
                            {METRIC_CATEGORIES.find(c => c.value === metric.metric_category)?.label} - {metric.metric_date}
                          </p>
                          {metric.notes && <p className="text-xs text-gray-500">{metric.notes}</p>}
                          {metric.calculation_type && (
                            <p className="text-xs text-blue-600">
                              {CALCULATION_CONFIGS.find(c => c.type === metric.calculation_type)?.name}: {metric.calculation_result?.toFixed(2)}%
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMetric(metric.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cálculo de Porcentagens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="calculation-type">Tipo de Cálculo</Label>
                  <Select
                    value={calculation.type}
                    onValueChange={(value: CalculationType) => setCalculation(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de cálculo" />
                    </SelectTrigger>
                    <SelectContent>
                      {CALCULATION_CONFIGS.map((config) => (
                        <SelectItem key={config.type} value={config.type}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCalculationConfig && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">{selectedCalculationConfig.name}</h4>
                    <p className="text-sm text-blue-700 mt-1">{selectedCalculationConfig.description}</p>
                    <p className="text-sm font-mono text-blue-800 mt-2">{selectedCalculationConfig.formula}</p>
                    <p className="text-xs text-blue-600 mt-2">{selectedCalculationConfig.explanation}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source-node">Nó de Origem (Valor 1)</Label>
                    <Select
                      value={calculation.sourceNodeId}
                      onValueChange={(value) => setCalculation(prev => ({ ...prev, sourceNodeId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nó de origem" />
                      </SelectTrigger>
                      <SelectContent>
                        {allNodes.map((n) => (
                          <SelectItem key={n.id} value={n.id}>
                            {n.data.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="target-node">Nó de Destino (Valor 2)</Label>
                    <Select
                      value={calculation.targetNodeId}
                      onValueChange={(value) => setCalculation(prev => ({ ...prev, targetNodeId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nó de destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {allNodes.map((n) => (
                          <SelectItem key={n.id} value={n.id}>
                            {n.data.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculatePercentage} className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Porcentagem
                </Button>

                {calculation.result !== null && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Resultado do Cálculo</h4>
                    <p className="text-2xl font-bold text-green-800">{calculation.result.toFixed(2)}%</p>
                    {selectedCalculationConfig && (
                      <p className="text-sm text-green-600 mt-2">{selectedCalculationConfig.explanation}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
