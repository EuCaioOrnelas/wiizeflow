
-- Primeiro, remover temporariamente o trigger que está causando conflito
DROP TRIGGER IF EXISTS update_user_activity ON public.profiles;

-- Criar usuário no auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'quenani@gmail.com',
  crypt('Quenani123', gen_salt('bf')),
  now(),
  null,
  '',
  null,
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Quenani"}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Criar perfil para o usuário
DO $$
DECLARE
    quenani_user_id UUID;
BEGIN
    -- Obter o ID do usuário recém-criado
    SELECT id INTO quenani_user_id 
    FROM auth.users 
    WHERE email = 'quenani@gmail.com';
    
    -- Inserir no profiles
    INSERT INTO public.profiles (
        id,
        name,
        email,
        plan_type,
        subscription_status,
        subscription_expires_at,
        funnel_count,
        created_at,
        updated_at
    ) VALUES (
        quenani_user_id,
        'Quenani',
        'quenani@gmail.com',
        'annual',
        'active',
        now() + INTERVAL '1 year',
        0,
        now(),
        now()
    );
END $$;

-- Adicionar coluna para excluir usuários do cálculo de receita
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS exclude_from_revenue BOOLEAN DEFAULT FALSE;

-- Marcar este usuário para ser excluído do cálculo de receita
UPDATE public.profiles 
SET exclude_from_revenue = TRUE 
WHERE email = 'quenani@gmail.com';

-- Recriar o trigger
CREATE TRIGGER update_user_activity
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_session();

-- Atualizar a função get_admin_dashboard_stats para excluir usuários marcados
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE (
  online_users BIGINT,
  total_users BIGINT,
  free_users BIGINT,
  monthly_users BIGINT,
  annual_users BIGINT,
  projected_monthly_revenue NUMERIC
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_user_admin BOOLEAN;
BEGIN
  -- Verificar se o usuário é admin usando função auxiliar
  SELECT public.is_admin(auth.uid()) INTO is_user_admin;
  
  IF NOT is_user_admin THEN
    -- Retornar zeros se não for admin
    RETURN QUERY SELECT 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::NUMERIC;
    RETURN;
  END IF;
  
  -- Retornar estatísticas reais para admins, excluindo usuários marcados
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.user_sessions 
     WHERE last_activity > now() - INTERVAL '15 minutes'),
    (SELECT COUNT(*) FROM public.profiles),
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'free' AND COALESCE(exclude_from_revenue, FALSE) = FALSE),
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'monthly' AND COALESCE(exclude_from_revenue, FALSE) = FALSE),
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'annual' AND COALESCE(exclude_from_revenue, FALSE) = FALSE),
    COALESCE((SELECT COUNT(*) FROM public.profiles 
              WHERE plan_type = 'monthly' AND COALESCE(exclude_from_revenue, FALSE) = FALSE), 0) * 47.00 +
    COALESCE((SELECT COUNT(*) FROM public.profiles 
              WHERE plan_type = 'annual' AND COALESCE(exclude_from_revenue, FALSE) = FALSE), 0) * (397.00 / 12);
END;
$$;
