
-- Atualizar a função handle_new_user para sempre inserir usuários no banco
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atualizar função para verificar assinaturas expiradas
CREATE OR REPLACE FUNCTION public.check_expired_subscriptions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_count INTEGER := 0;
BEGIN
  -- Atualizar usuários com assinaturas expiradas para plano gratuito
  UPDATE public.profiles 
  SET 
    plan_type = 'free',
    subscription_status = 'expired',
    updated_at = now()
  WHERE 
    subscription_expires_at IS NOT NULL 
    AND subscription_expires_at < now() 
    AND plan_type != 'free'
    AND (subscription_status = 'active' OR subscription_status IS NULL);
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  RETURN expired_count;
END;
$$;

-- Sincronizar usuários existentes que podem não estar no profiles
SELECT public.sync_existing_users();
