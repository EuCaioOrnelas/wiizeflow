
-- Dar acesso vitalício ao administrador
UPDATE public.profiles 
SET 
  plan_type = 'annual',
  subscription_status = 'active',
  subscription_expires_at = NULL,
  updated_at = now()
WHERE email = 'admin@wiizeflow.com.br' OR email = 'adminwiize@wiizeflow.com.br';

-- Criar tabela de avisos administrativos
CREATE TABLE public.avisos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para avisos
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

-- Política para admins poderem gerenciar avisos
CREATE POLICY "Admins can manage avisos" 
  ON public.avisos 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email = 'adminwiize@wiizeflow.com.br'
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

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_avisos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_avisos_updated_at_trigger
    BEFORE UPDATE ON public.avisos
    FOR EACH ROW
    EXECUTE FUNCTION update_avisos_updated_at();
