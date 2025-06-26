
-- Habilitar RLS na tabela funnel_shares
ALTER TABLE public.funnel_shares ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer pessoa visualize compartilhamentos válidos (público)
CREATE POLICY "Anyone can view valid shares"
ON public.funnel_shares
FOR SELECT
TO public
USING (true);

-- Política para permitir que proprietários criem compartilhamentos
CREATE POLICY "Owners can create shares"
ON public.funnel_shares
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Política para permitir que proprietários atualizem seus compartilhamentos
CREATE POLICY "Owners can update their shares"
ON public.funnel_shares
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Política para permitir que proprietários deletem seus compartilhamentos
CREATE POLICY "Owners can delete their shares"
ON public.funnel_shares
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Habilitar RLS na tabela funnels se não estiver habilitado
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Atualizar política de visualização de funis para permitir acesso via compartilhamento
DROP POLICY IF EXISTS "Users can view their own funnels" ON public.funnels;

CREATE POLICY "Users can view their own funnels"
ON public.funnels
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Nova política para permitir visualização de funis compartilhados (público)
CREATE POLICY "Anyone can view shared funnels"
ON public.funnels
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.funnel_shares 
    WHERE funnel_shares.funnel_id = funnels.id
  )
);

-- Habilitar RLS na tabela profiles se não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir visualização pública de nomes de proprietários em funis compartilhados
CREATE POLICY "Public can view profile names for shared funnels"
ON public.profiles
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.funnel_shares fs
    JOIN public.funnels f ON fs.funnel_id = f.id
    WHERE f.user_id = profiles.id
  )
);

-- Política para usuários autenticados verem seus próprios perfis
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Política para usuários autenticados atualizarem seus próprios perfis
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
