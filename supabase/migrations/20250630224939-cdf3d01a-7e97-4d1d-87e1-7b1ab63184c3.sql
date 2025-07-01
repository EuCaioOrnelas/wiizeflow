
-- Verificar e ajustar as políticas RLS para dashboard_shares
-- Permitir acesso público para leitura de dashboards compartilhados
DROP POLICY IF EXISTS "Public can view shared dashboards" ON public.dashboard_shares;
CREATE POLICY "Public can view shared dashboards" 
  ON public.dashboard_shares 
  FOR SELECT 
  USING (true);

-- Permitir acesso público às métricas dos nós para dashboards compartilhados
DROP POLICY IF EXISTS "Public can view metrics for shared dashboards" ON public.node_metrics;
CREATE POLICY "Public can view metrics for shared dashboards" 
  ON public.node_metrics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.dashboard_shares ds 
      WHERE ds.funnel_id = node_metrics.funnel_id
    )
  );

-- Permitir acesso público aos dados do funil para dashboards compartilhados
DROP POLICY IF EXISTS "Public can view shared funnels" ON public.funnels;
CREATE POLICY "Public can view shared funnels" 
  ON public.funnels 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.dashboard_shares ds 
      WHERE ds.funnel_id = funnels.id
    )
  );
