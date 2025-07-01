
-- Corrigir a função handle_new_user para garantir criação adequada do perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Inserir o usuário no profiles com dados completos
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    plan_type, 
    funnel_count, 
    free_trial_started_at,
    free_trial_expires_at,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'name', 
      NEW.raw_user_meta_data ->> 'full_name', 
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    'free',
    0,
    NOW(),
    NOW() + INTERVAL '30 days',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    free_trial_started_at = COALESCE(profiles.free_trial_started_at, NOW()),
    free_trial_expires_at = COALESCE(profiles.free_trial_expires_at, NOW() + INTERVAL '30 days'),
    updated_at = NOW();
  
  -- Inserir sessão do usuário (somente se o perfil foi criado com sucesso)
  INSERT INTO public.user_sessions (user_id, session_token, last_activity)
  VALUES (NEW.id, 'session_' || NEW.id, NOW())
  ON CONFLICT (user_id, session_token) 
  DO UPDATE SET last_activity = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro mas não bloqueia a criação do usuário
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Garantir que o trigger existe e está ativo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sincronizar usuários existentes que podem não ter perfil completo
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data, au.created_at
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    WHERE p.id IS NULL OR p.free_trial_expires_at IS NULL
  LOOP
    INSERT INTO public.profiles (
      id, 
      name, 
      email, 
      plan_type, 
      funnel_count,
      free_trial_started_at,
      free_trial_expires_at,
      created_at, 
      updated_at
    )
    VALUES (
      user_record.id,
      COALESCE(
        user_record.raw_user_meta_data ->> 'name', 
        user_record.raw_user_meta_data ->> 'full_name', 
        split_part(user_record.email, '@', 1),
        'Usuário'
      ),
      user_record.email,
      'free',
      0,
      COALESCE(user_record.created_at, NOW()),
      COALESCE(user_record.created_at, NOW()) + INTERVAL '30 days',
      user_record.created_at,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      free_trial_started_at = COALESCE(profiles.free_trial_started_at, user_record.created_at, NOW()),
      free_trial_expires_at = COALESCE(profiles.free_trial_expires_at, user_record.created_at + INTERVAL '30 days', NOW() + INTERVAL '30 days'),
      updated_at = NOW();
  END LOOP;
END $$;
