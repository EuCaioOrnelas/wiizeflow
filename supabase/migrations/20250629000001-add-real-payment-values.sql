
-- Adicionar campos para armazenar valores reais pagos pelos clientes
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS annual_amount DECIMAL(10,2);

-- Atualizar valores padrão para clientes existentes sem valores específicos
UPDATE public.profiles 
SET 
  monthly_amount = 47.00,
  annual_amount = 397.00
WHERE plan_type = 'monthly' 
  AND monthly_amount IS NULL;

UPDATE public.profiles 
SET 
  annual_amount = 397.00,
  monthly_amount = 47.00  
WHERE plan_type = 'annual' 
  AND annual_amount IS NULL;

-- Atualizar a função get_admin_dashboard_stats para usar valores reais
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
  
  -- Retornar estatísticas reais para admins, usando valores reais pagos
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.user_sessions 
     WHERE last_activity > now() - INTERVAL '15 minutes'),
    (SELECT COUNT(*) FROM public.profiles),
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'free'),
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'monthly' 
       AND COALESCE(exclude_from_revenue, FALSE) = FALSE
       AND stripe_customer_id IS NOT NULL 
       AND stripe_customer_id != ''),
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'annual' 
       AND COALESCE(exclude_from_revenue, FALSE) = FALSE
       AND stripe_customer_id IS NOT NULL 
       AND stripe_customer_id != ''),
    -- Calcular receita mensal real baseada nos valores que cada cliente paga
    COALESCE((SELECT SUM(COALESCE(monthly_amount, 47.00)) FROM public.profiles 
              WHERE plan_type = 'monthly' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0) +
    COALESCE((SELECT SUM(COALESCE(annual_amount, 397.00) / 12) FROM public.profiles 
              WHERE plan_type = 'annual' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0);
END;
$$;

-- Criar função auxiliar para obter detalhes de receita real
CREATE OR REPLACE FUNCTION public.get_revenue_details()
RETURNS TABLE (
  monthly_revenue NUMERIC,
  annual_monthly_revenue NUMERIC,
  total_monthly_revenue NUMERIC,
  monthly_count BIGINT,
  annual_count BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_user_admin BOOLEAN;
BEGIN
  -- Verificar se o usuário é admin
  SELECT public.is_admin(auth.uid()) INTO is_user_admin;
  
  IF NOT is_user_admin THEN
    -- Retornar zeros se não for admin
    RETURN QUERY SELECT 0::NUMERIC, 0::NUMERIC, 0::NUMERIC, 0::BIGINT, 0::BIGINT;
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    -- Receita real dos planos mensais
    COALESCE((SELECT SUM(COALESCE(monthly_amount, 47.00)) FROM public.profiles 
              WHERE plan_type = 'monthly' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0),
    -- Receita mensal dos planos anuais (dividido por 12)
    COALESCE((SELECT SUM(COALESCE(annual_amount, 397.00) / 12) FROM public.profiles 
              WHERE plan_type = 'annual' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0),
    -- Total mensal
    COALESCE((SELECT SUM(COALESCE(monthly_amount, 47.00)) FROM public.profiles 
              WHERE plan_type = 'monthly' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0) +
    COALESCE((SELECT SUM(COALESCE(annual_amount, 397.00) / 12) FROM public.profiles 
              WHERE plan_type = 'annual' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0),
    -- Contagem de usuários mensais
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'monthly' 
       AND COALESCE(exclude_from_revenue, FALSE) = FALSE
       AND stripe_customer_id IS NOT NULL 
       AND stripe_customer_id != ''),
    -- Contagem de usuários anuais
    (SELECT COUNT(*) FROM public.profiles 
     WHERE plan_type = 'annual' 
       AND COALESCE(exclude_from_revenue, FALSE) = FALSE
       AND stripe_customer_id IS NOT NULL 
       AND stripe_customer_id != '');
END;
$$;
