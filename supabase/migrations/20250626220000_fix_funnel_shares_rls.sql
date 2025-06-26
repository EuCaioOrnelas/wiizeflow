
-- Criar políticas RLS para funnel_shares
DROP POLICY IF EXISTS "Users can view their own funnel shares" ON public.funnel_shares;
DROP POLICY IF EXISTS "Users can create their own funnel shares" ON public.funnel_shares;
DROP POLICY IF EXISTS "Users can update their own funnel shares" ON public.funnel_shares;
DROP POLICY IF EXISTS "Users can delete their own funnel shares" ON public.funnel_shares;
DROP POLICY IF EXISTS "Anyone can view shared funnels" ON public.funnel_shares;

-- Habilitar RLS na tabela funnel_shares
ALTER TABLE public.funnel_shares ENABLE ROW LEVEL SECURITY;

-- Política para proprietários gerenciarem seus compartilhamentos
CREATE POLICY "Users can manage their own funnel shares" 
  ON public.funnel_shares 
  FOR ALL 
  USING (owner_id = auth.uid());

-- Política para permitir acesso público aos compartilhamentos (para visualização)
CREATE POLICY "Public can view shared funnels" 
  ON public.funnel_shares 
  FOR SELECT 
  USING (true);

-- Adicionar políticas RLS para funnels permitindo acesso via compartilhamento
CREATE POLICY "Public can view shared funnels data" 
  ON public.funnels 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.funnel_shares 
      WHERE funnel_shares.funnel_id = funnels.id
    )
  );
