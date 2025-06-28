
-- Corrigir a função handle_new_user para permitir cadastro de novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Inserir o usuário no profiles independente do plano
  INSERT INTO public.profiles (id, name, email, plan_type, funnel_count, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'free', -- Sempre começa como free até fazer upgrade
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = NOW();
  
  -- Inserir sessão do usuário
  INSERT INTO public.user_sessions (user_id, session_token, last_activity)
  VALUES (NEW.id, 'session_' || NEW.id, NOW())
  ON CONFLICT (user_id, session_token) 
  DO UPDATE SET last_activity = NOW();
  
  RETURN NEW;
END;
$$;

-- Garantir que o trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

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

-- Garantir que RLS está habilitado na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Garantir que RLS está habilitado na tabela user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Adicionar políticas para user_sessions (removendo as existentes primeiro)
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Service can manage sessions" ON public.user_sessions;

CREATE POLICY "Users can manage their own sessions" ON public.user_sessions
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Service can manage sessions" ON public.user_sessions
  FOR INSERT
  WITH CHECK (true);
