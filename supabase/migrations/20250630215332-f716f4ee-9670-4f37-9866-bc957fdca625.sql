
-- Criar enum para categorias de métricas
CREATE TYPE metric_category AS ENUM (
  'visitantes_unicos',
  'cliques', 
  'lead_capturado',
  'oportunidades',
  'vendas_realizadas',
  'pos_venda'
);

-- Criar enum para tipos de cálculos
CREATE TYPE calculation_type AS ENUM (
  'taxa_conversao',
  'taxa_qualificacao_leads',
  'taxa_oportunidades_mql',
  'taxa_fechamento',
  'taxa_churn',
  'taxa_retencao',
  'taxa_recompra',
  'taxa_resposta_vendas',
  'taxa_follow_up'
);

-- Adicionar novos campos à tabela de métricas nos nós
-- Como não temos uma tabela específica para métricas, vamos expandir o sistema existente
-- adicionando uma nova tabela para armazenar métricas detalhadas

CREATE TABLE public.node_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_category metric_category NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  calculation_type calculation_type NULL,
  calculation_result NUMERIC NULL,
  source_node_id TEXT NULL,
  target_node_id TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para segurança
ALTER TABLE public.node_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own metrics" 
  ON public.node_metrics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own metrics" 
  ON public.node_metrics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics" 
  ON public.node_metrics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metrics" 
  ON public.node_metrics 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX idx_node_metrics_funnel_id ON public.node_metrics(funnel_id);
CREATE INDEX idx_node_metrics_user_id ON public.node_metrics(user_id);
CREATE INDEX idx_node_metrics_category ON public.node_metrics(metric_category);
CREATE INDEX idx_node_metrics_date ON public.node_metrics(metric_date);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_node_metrics_updated_at
  BEFORE UPDATE ON public.node_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
