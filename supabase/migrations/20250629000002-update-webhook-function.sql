
-- Atualizar a função process_stripe_webhook para armazenar valores reais
CREATE OR REPLACE FUNCTION public.process_stripe_webhook(
  event_type text, 
  customer_email text, 
  customer_id text, 
  subscription_id text, 
  price_id text, 
  session_id text DEFAULT NULL::text,
  amount_paid integer DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_record RECORD;
  plan_name TEXT;
  expires_at TIMESTAMPTZ;
  monthly_amount_value DECIMAL(10,2);
  annual_amount_value DECIMAL(10,2);
BEGIN
  -- Determinar nome do plano e valores baseado no price_id e amount_paid
  CASE price_id
    WHEN 'price_1RdhpHG1GdQ2ZjmFmYXfEFJa' THEN 
      plan_name := 'monthly';
      expires_at := now() + INTERVAL '1 month';
      -- Se amount_paid foi fornecido, usar ele, senão usar valor padrão
      monthly_amount_value := COALESCE(amount_paid / 100.0, 47.00);
      annual_amount_value := 397.00;
    WHEN 'price_1RdhqYG1GdQ2ZjmFlAOaBr4A' THEN 
      plan_name := 'annual';
      expires_at := now() + INTERVAL '1 year';
      monthly_amount_value := 47.00;
      -- Se amount_paid foi fornecido, usar ele, senão usar valor padrão
      annual_amount_value := COALESCE(amount_paid / 100.0, 397.00);
    ELSE 
      plan_name := 'monthly';
      expires_at := now() + INTERVAL '1 month';
      monthly_amount_value := COALESCE(amount_paid / 100.0, 47.00);
      annual_amount_value := 397.00;
  END CASE;

  -- Buscar usuário pelo email
  SELECT * INTO user_record 
  FROM public.profiles 
  WHERE email = customer_email 
  LIMIT 1;

  IF event_type = 'checkout.session.completed' OR event_type = 'invoice.payment_succeeded' THEN
    IF user_record.id IS NOT NULL THEN
      -- Usuário existe, atualizar plano com valores reais
      UPDATE public.profiles 
      SET 
        plan_type = plan_name,
        subscription_status = 'active',
        subscription_expires_at = expires_at,
        stripe_customer_id = customer_id,
        stripe_subscription_id = subscription_id,
        monthly_amount = monthly_amount_value,
        annual_amount = annual_amount_value,
        updated_at = now()
      WHERE id = user_record.id;
    ELSE
      -- Usuário não existe, criar registro pendente com valores reais
      INSERT INTO public.profiles (
        id,
        email,
        name,
        plan_type,
        subscription_status,
        subscription_expires_at,
        stripe_customer_id,
        stripe_subscription_id,
        monthly_amount,
        annual_amount,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        customer_email,
        split_part(customer_email, '@', 1),
        plan_name,
        'pending_activation',
        expires_at,
        customer_id,
        subscription_id,
        monthly_amount_value,
        annual_amount_value,
        now(),
        now()
      );
    END IF;

    -- Atualizar tabela de orders
    UPDATE public.orders 
    SET 
      status = 'paid',
      user_id = COALESCE(user_record.id, (
        SELECT id FROM public.profiles WHERE email = customer_email LIMIT 1
      )),
      updated_at = now()
    WHERE stripe_session_id = session_id OR customer_email = customer_email;

  ELSIF event_type = 'customer.subscription.deleted' OR event_type = 'invoice.payment_failed' THEN
    -- Registrar falha de pagamento
    INSERT INTO public.payment_failures (
      user_id,
      stripe_customer_id,
      stripe_subscription_id,
      failure_reason,
      failure_date
    ) VALUES (
      user_record.id,
      customer_id,
      subscription_id,
      event_type,
      now()
    );
    
    -- Cancelar assinatura
    UPDATE public.profiles 
    SET 
      plan_type = 'free',
      subscription_status = 'canceled',
      updated_at = now()
    WHERE stripe_customer_id = customer_id OR email = customer_email;
  END IF;

  RETURN json_build_object(
    'success', true,
    'event_type', event_type,
    'customer_email', customer_email,
    'plan_name', plan_name,
    'amount_paid', amount_paid
  );
END;
$$;
