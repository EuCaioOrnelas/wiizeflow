
-- Habilitar RLS na tabela profiles se não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela user_sessions se não estiver habilitado
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Adicionar as políticas RLS básicas para profiles se não existirem
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Adicionar políticas para user_sessions (removendo as existentes primeiro)
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Service can manage sessions" ON public.user_sessions;

CREATE POLICY "Users can manage their own sessions" ON public.user_sessions
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Service can manage sessions" ON public.user_sessions
  FOR INSERT
  WITH CHECK (true);
