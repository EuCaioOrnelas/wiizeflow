
-- Corrigir as políticas RLS da tabela avisos
DROP POLICY IF EXISTS "Admins can manage avisos" ON public.avisos;
DROP POLICY IF EXISTS "Users can read recent active avisos" ON public.avisos;

-- Política para admins gerenciarem avisos (usando a tabela profiles)
CREATE POLICY "Admins can manage avisos" 
  ON public.avisos 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (email = 'adminwiize@wiizeflow.com.br' OR email = 'admin@wiizeflow.com.br')
    )
  );

-- Política para usuários normais lerem avisos ativos dos últimos 30 dias
CREATE POLICY "Users can read recent active avisos" 
  ON public.avisos 
  FOR SELECT
  TO authenticated
  USING (
    ativo = true 
    AND data_criacao >= now() - INTERVAL '30 days'
  );
