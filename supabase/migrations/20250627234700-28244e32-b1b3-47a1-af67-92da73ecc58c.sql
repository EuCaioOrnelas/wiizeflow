
-- Reverter as alterações da migração anterior
-- Remover as políticas RLS que foram adicionadas
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Service can manage sessions" ON public.user_sessions;

-- Remover o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Restaurar a função handle_new_user() para a versão anterior (se necessário)
-- Ou removê-la completamente se foi criada nesta migração
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Desabilitar RLS nas tabelas se foi habilitado nesta migração
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions DISABLE ROW LEVEL SECURITY;
