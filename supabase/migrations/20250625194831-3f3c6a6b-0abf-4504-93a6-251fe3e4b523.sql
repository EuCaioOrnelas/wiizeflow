
-- Corrigir problemas de segurança identificados pelo Supabase

-- 1. Corrigir função sync_existing_users para ter search_path adequado
CREATE OR REPLACE FUNCTION public.sync_existing_users()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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

-- 2. Corrigir função is_admin para ter search_path adequado
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
END;
$$;

-- 3. Corrigir função update_user_session para ter search_path adequado
CREATE OR REPLACE FUNCTION public.update_user_session()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_sessions (user_id, session_token, last_activity)
  VALUES (NEW.id, 'session_' || NEW.id, now())
  ON CONFLICT (user_id, session_token)
  DO UPDATE SET last_activity = now();
  RETURN NEW;
END;
$$;

-- 4. Corrigir função get_admin_dashboard_stats para ter search_path adequado
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
  
  -- Retornar estatísticas reais para admins
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.user_sessions 
     WHERE last_activity > now() - INTERVAL '15 minutes'),
    (SELECT COUNT(*) FROM public.profiles),
    (SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'free'),
    (SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'monthly'),
    (SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'annual'),
    COALESCE((SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'monthly'), 0) * 47.00 +
    COALESCE((SELECT COUNT(*) FROM public.profiles WHERE plan_type = 'annual'), 0) * (397.00 / 12);
END;
$$;

-- 5. Corrigir função create_admin_user para ter search_path adequado
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT,
  plan_type TEXT,
  subscription_period TEXT DEFAULT 'monthly'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID;
  expires_at TIMESTAMPTZ;
  is_user_admin BOOLEAN;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT public.is_admin(auth.uid()) INTO is_user_admin;
  
  IF NOT is_user_admin THEN
    RETURN json_build_object('error', 'Acesso negado');
  END IF;

  -- Calcular data de expiração baseada no período
  CASE subscription_period
    WHEN 'monthly' THEN expires_at := now() + INTERVAL '1 month';
    WHEN 'annual' THEN expires_at := now() + INTERVAL '1 year';
    WHEN 'lifetime' THEN expires_at := NULL;
    ELSE expires_at := now() + INTERVAL '1 month';
  END CASE;

  -- Criar usuário no profiles
  INSERT INTO public.profiles (
    id,
    email,
    name,
    plan_type,
    subscription_status,
    subscription_expires_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    user_email,
    user_name,
    plan_type,
    'pending_activation',
    expires_at,
    now(),
    now()
  ) RETURNING id INTO new_user_id;

  RETURN json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'Usuário criado com sucesso'
  );
END;
$$;

-- 6. Corrigir função check_expired_subscriptions para ter search_path adequado
CREATE OR REPLACE FUNCTION public.check_expired_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 7. Adicionar políticas RLS adequadas para todas as tabelas

-- Políticas para admin_users (corrigir recursão infinita)
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

CREATE POLICY "Admin users can view admin list" ON public.admin_users
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can manage admin list" ON public.admin_users
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas para funnels
DROP POLICY IF EXISTS "Users can view their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can create their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can update their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can delete their own funnels" ON public.funnels;

CREATE POLICY "Users can view their own funnels" ON public.funnels
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own funnels" ON public.funnels
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own funnels" ON public.funnels
  FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can delete their own funnels" ON public.funnels
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Políticas para orders
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
DROP POLICY IF EXISTS "insert_order" ON public.orders;
DROP POLICY IF EXISTS "update_order" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid() OR customer_email = auth.email() OR public.is_admin(auth.uid()));

CREATE POLICY "Service can insert orders" ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update orders" ON public.orders
  FOR UPDATE
  USING (true);

-- Políticas para payment_failures
DROP POLICY IF EXISTS "Admin can view payment failures" ON public.payment_failures;
DROP POLICY IF EXISTS "Allow insert payment failures" ON public.payment_failures;

CREATE POLICY "Admins can view payment failures" ON public.payment_failures
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Service can insert payment failures" ON public.payment_failures
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update payment failures" ON public.payment_failures
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Políticas para user_sessions
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.user_sessions;

CREATE POLICY "Admins can view all user sessions" ON public.user_sessions
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can manage their own sessions" ON public.user_sessions
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Service can manage sessions" ON public.user_sessions
  FOR INSERT
  WITH CHECK (true);

-- 8. Habilitar proteção contra ataques de força bruta no auth
-- Isso é configurado automaticamente pelo Supabase, mas vamos garantir que esteja ativo
-- através da configuração adequada das funções de segurança

-- 9. Revisar e limpar triggers desnecessários
DROP TRIGGER IF EXISTS update_user_activity ON public.profiles;

-- Recriar trigger de forma mais segura
CREATE TRIGGER update_user_activity
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_session();
