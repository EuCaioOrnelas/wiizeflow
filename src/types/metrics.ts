
export type MetricCategory = 
  | 'visitantes_unicos'
  | 'cliques' 
  | 'lead_capturado'
  | 'oportunidades'
  | 'vendas_realizadas'
  | 'pos_venda';

export type CalculationType = 
  | 'taxa_conversao'
  | 'taxa_qualificacao_leads'
  | 'taxa_oportunidades_mql'
  | 'taxa_fechamento'
  | 'taxa_churn'
  | 'taxa_retencao'
  | 'taxa_recompra'
  | 'taxa_resposta_vendas'
  | 'taxa_follow_up';

export interface NodeMetric {
  id: string;
  funnel_id: string;
  node_id: string;
  user_id: string;
  metric_value: number;
  metric_category: MetricCategory;
  metric_date: string;
  calculation_type?: CalculationType;
  calculation_result?: number;
  source_node_id?: string;
  target_node_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CalculationConfig {
  type: CalculationType;
  name: string;
  description: string;
  formula: string;
  explanation: string;
}

export interface FunnelDashboardData {
  visitantes: number;
  leads: number;
  oportunidades: number;
  vendas: number;
  conversao_leads: number;
  conversao_oportunidades: number;
  conversao_vendas: number;
}
