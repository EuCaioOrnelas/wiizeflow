
-- Primeiro, remover temporariamente o trigger que está causando conflito
DROP TRIGGER IF EXISTS update_user_activity ON public.profiles;

-- Marcar todos os usuários anuais sem stripe_customer_id para serem excluídos da receita
UPDATE public.profiles 
SET exclude_from_revenue = TRUE 
WHERE plan_type = 'annual' 
  AND (stripe_customer_id IS NULL OR stripe_customer_id = '');

-- Também marcar usuários mensais sem stripe_customer_id para serem excluídos da receita
UPDATE public.profiles 
SET exclude_from_revenue = TRUE 
WHERE plan_type = 'monthly' 
  AND (stripe_customer_id IS NULL OR stripe_customer_id = '');

-- Atualizar a função get_admin_dashboard_stats para ser mais específica sobre usuários pagantes
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
  
  -- Retornar estatísticas reais para admins, excluindo usuários sem Stripe e marcados para exclusão
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
    COALESCE((SELECT COUNT(*) FROM public.profiles 
              WHERE plan_type = 'monthly' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0) * 47.00 +
    COALESCE((SELECT COUNT(*) FROM public.profiles 
              WHERE plan_type = 'annual' 
                AND COALESCE(exclude_from_revenue, FALSE) = FALSE
                AND stripe_customer_id IS NOT NULL 
                AND stripe_customer_id != ''), 0) * (397.00 / 12);
END;
$$;

-- Recriar o trigger
CREATE TRIGGER update_user_activity
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_session();
