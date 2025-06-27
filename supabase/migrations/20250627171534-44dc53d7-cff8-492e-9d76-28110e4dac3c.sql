
-- Criar tabela para rastrear eventos de usuários
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'login', 'funnel_created', 'funnel_opened', 'subscription_created', etc.
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela user_events
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Política para que apenas admins vejam todos os eventos
CREATE POLICY "Admin can view all events" ON public.user_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Política para inserção de eventos (edge functions e aplicação)
CREATE POLICY "Allow insert events" ON public.user_events
  FOR INSERT
  WITH CHECK (true);

-- Índices para performance nas consultas de métricas
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON public.user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_user_events_user_created ON public.user_events(user_id, created_at);

-- Função para calcular métricas de retenção e engajamento
CREATE OR REPLACE FUNCTION public.get_engagement_metrics()
RETURNS TABLE(
  dau bigint,
  wau bigint,
  mau bigint,
  users_with_funnels bigint,
  total_active_users bigint,
  freemium_to_paid_rate numeric,
  retention_30_days numeric,
  monthly_churn_rate numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_user_admin BOOLEAN;
  total_converted_users bigint;
  total_freemium_users bigint;
  total_30_day_cohort bigint;
  retained_30_day_users bigint;
  previous_month_subscriptions bigint;
  canceled_this_month bigint;
BEGIN
  -- Verificar se o usuário é admin
  SELECT public.is_admin(auth.uid()) INTO is_user_admin;
  
  IF NOT is_user_admin THEN
    -- Retornar zeros se não for admin
    RETURN QUERY SELECT 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::NUMERIC, 0::NUMERIC, 0::NUMERIC;
    RETURN;
  END IF;
  
  -- DAU (últimas 24 horas)
  SELECT COUNT(DISTINCT user_id) INTO dau
  FROM public.user_events
  WHERE created_at >= now() - INTERVAL '24 hours';
  
  -- WAU (últimos 7 dias)
  SELECT COUNT(DISTINCT user_id) INTO wau
  FROM public.user_events
  WHERE created_at >= now() - INTERVAL '7 days';
  
  -- MAU (últimos 30 dias)
  SELECT COUNT(DISTINCT user_id) INTO mau
  FROM public.user_events
  WHERE created_at >= now() - INTERVAL '30 days';
  
  -- Usuários que criaram pelo menos 1 funil
  SELECT COUNT(DISTINCT f.user_id) INTO users_with_funnels
  FROM public.funnels f
  INNER JOIN public.profiles p ON f.user_id = p.id
  WHERE p.created_at >= now() - INTERVAL '30 days';
  
  -- Total de usuários ativos (com eventos nos últimos 30 dias)
  SELECT COUNT(DISTINCT user_id) INTO total_active_users
  FROM public.user_events
  WHERE created_at >= now() - INTERVAL '30 days';
  
  -- Taxa de conversão freemium para pago
  SELECT COUNT(*) INTO total_converted_users
  FROM public.profiles
  WHERE plan_type IN ('monthly', 'annual')
    AND created_at >= now() - INTERVAL '30 days';
    
  SELECT COUNT(*) INTO total_freemium_users
  FROM public.profiles
  WHERE created_at >= now() - INTERVAL '30 days';
  
  freemium_to_paid_rate := CASE 
    WHEN total_freemium_users > 0 THEN 
      (total_converted_users::numeric / total_freemium_users::numeric) * 100
    ELSE 0
  END;
  
  -- Retenção de 30 dias
  SELECT COUNT(*) INTO total_30_day_cohort
  FROM public.profiles
  WHERE created_at BETWEEN now() - INTERVAL '60 days' AND now() - INTERVAL '30 days';
  
  SELECT COUNT(DISTINCT p.id) INTO retained_30_day_users
  FROM public.profiles p
  INNER JOIN public.user_events ue ON p.id = ue.user_id
  WHERE p.created_at BETWEEN now() - INTERVAL '60 days' AND now() - INTERVAL '30 days'
    AND ue.created_at >= now() - INTERVAL '30 days';
  
  retention_30_days := CASE 
    WHEN total_30_day_cohort > 0 THEN 
      (retained_30_day_users::numeric / total_30_day_cohort::numeric) * 100
    ELSE 0
  END;
  
  -- Taxa de churn mensal (baseado em assinaturas canceladas)
  SELECT COUNT(*) INTO previous_month_subscriptions
  FROM public.profiles
  WHERE plan_type IN ('monthly', 'annual')
    AND subscription_status = 'active'
    AND created_at <= now() - INTERVAL '1 month';
  
  SELECT COUNT(*) INTO canceled_this_month
  FROM public.profiles
  WHERE subscription_status IN ('canceled', 'expired')
    AND updated_at >= now() - INTERVAL '1 month';
  
  monthly_churn_rate := CASE 
    WHEN previous_month_subscriptions > 0 THEN 
      (canceled_this_month::numeric / previous_month_subscriptions::numeric) * 100
    ELSE 0
  END;
  
  RETURN QUERY SELECT dau, wau, mau, users_with_funnels, total_active_users, 
                      freemium_to_paid_rate, retention_30_days, monthly_churn_rate;
END;
$$;

-- Trigger para registrar eventos automaticamente quando usuário faz login
CREATE OR REPLACE FUNCTION public.log_user_login_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Registrar evento de login
  INSERT INTO public.user_events (user_id, event_type, event_data)
  VALUES (NEW.id, 'login', jsonb_build_object('timestamp', now()));
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger para logar eventos de login
DROP TRIGGER IF EXISTS log_login_event ON public.user_sessions;
CREATE TRIGGER log_login_event
  AFTER INSERT ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_user_login_event();

-- Trigger para registrar quando usuário cria funil
CREATE OR REPLACE FUNCTION public.log_funnel_creation_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Registrar evento de criação de funil
  INSERT INTO public.user_events (user_id, event_type, event_data)
  VALUES (NEW.user_id, 'funnel_created', jsonb_build_object('funnel_id', NEW.id, 'funnel_name', NEW.name));
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger para logar criação de funis
DROP TRIGGER IF EXISTS log_funnel_creation ON public.funnels;
CREATE TRIGGER log_funnel_creation
  AFTER INSERT ON public.funnels
  FOR EACH ROW
  EXECUTE FUNCTION public.log_funnel_creation_event();
