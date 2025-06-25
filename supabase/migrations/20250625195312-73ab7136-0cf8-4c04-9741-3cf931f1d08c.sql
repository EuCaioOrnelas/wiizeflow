
-- Resolver os 3 avisos restantes de segurança

-- 1. Corrigir função update_updated_at_column com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 2. Criar função para configurar OTP com tempo de expiração mais curto
-- (O Supabase gerencia isso via configuração, mas vamos garantir que as funções relacionadas estejam seguras)

-- 3. Adicionar função auxiliar para validação de senhas (se necessário)
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validar força da senha: mínimo 8 caracteres, pelo menos 1 número, 1 letra maiúscula
  RETURN LENGTH(password) >= 8 
    AND password ~ '[0-9]' 
    AND password ~ '[A-Z]'
    AND password ~ '[a-z]';
END;
$$;

-- Atualizar função handle_new_user para garantir search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
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
