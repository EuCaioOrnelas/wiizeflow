
-- Primeiro, vamos verificar se o trigger está funcionando corretamente
-- e ajustar a função para garantir que todos os usuários sejam salvos

-- Atualizar a função handle_new_user para ser mais robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, plan_type, funnel_count, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', 'Usuário'),
    NEW.email,
    'free',
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Garantir que o trigger está ativo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Adicionar uma função para sincronizar usuários existentes que podem não ter sido salvos
CREATE OR REPLACE FUNCTION public.sync_existing_users()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  synced_count INTEGER := 0;
  user_record RECORD;
BEGIN
  -- Inserir usuários do auth.users que não existem em profiles
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data, au.created_at
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    INSERT INTO public.profiles (id, name, email, plan_type, funnel_count, created_at, updated_at)
    VALUES (
      user_record.id,
      COALESCE(user_record.raw_user_meta_data ->> 'name', user_record.raw_user_meta_data ->> 'full_name', 'Usuário'),
      user_record.email,
      'free',
      0,
      user_record.created_at,
      NOW()
    );
    synced_count := synced_count + 1;
  END LOOP;
  
  RETURN synced_count;
END;
$$;

-- Executar a sincronização uma vez para capturar usuários existentes
SELECT public.sync_existing_users();
