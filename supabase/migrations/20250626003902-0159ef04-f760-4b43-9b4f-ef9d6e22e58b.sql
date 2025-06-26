
-- Criar tabela para armazenar links de compartilhamento de funis
CREATE TABLE public.funnel_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT NOT NULL UNIQUE,
  allow_download BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice único para o token de compartilhamento
CREATE UNIQUE INDEX funnel_shares_share_token_idx ON public.funnel_shares(share_token);

-- Criar índice para busca por funnel_id
CREATE INDEX funnel_shares_funnel_id_idx ON public.funnel_shares(funnel_id);

-- Habilitar RLS na tabela funnel_shares
ALTER TABLE public.funnel_shares ENABLE ROW LEVEL SECURITY;

-- Política para permitir que donos vejam seus próprios compartilhamentos
CREATE POLICY "Users can view their own funnel shares" 
  ON public.funnel_shares 
  FOR SELECT 
  USING (owner_id = auth.uid());

-- Política para permitir que donos criem compartilhamentos de seus funis
CREATE POLICY "Users can create shares for their own funnels" 
  ON public.funnel_shares 
  FOR INSERT 
  WITH CHECK (
    owner_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.funnels 
      WHERE id = funnel_id AND user_id = auth.uid()
    )
  );

-- Política para permitir que donos atualizem seus próprios compartilhamentos
CREATE POLICY "Users can update their own funnel shares" 
  ON public.funnel_shares 
  FOR UPDATE 
  USING (owner_id = auth.uid());

-- Política para permitir que donos deletem seus próprios compartilhamentos
CREATE POLICY "Users can delete their own funnel shares" 
  ON public.funnel_shares 
  FOR DELETE 
  USING (owner_id = auth.uid());

-- Política especial para permitir acesso público aos funis compartilhados (apenas SELECT)
CREATE POLICY "Allow public access to shared funnels" 
  ON public.funnels 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.funnel_shares 
      WHERE funnel_id = id
    )
  );

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_funnel_shares_updated_at 
    BEFORE UPDATE ON public.funnel_shares 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
