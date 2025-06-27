
-- Criar função para processar webhooks do Stripe
CREATE OR REPLACE FUNCTION public.process_stripe_webhook(
  event_type TEXT,
  customer_email TEXT,
  customer_id TEXT,
  subscription_id TEXT,
  price_id TEXT,
  session_id TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  plan_name TEXT;
  expires_at TIMESTAMPTZ;
BEGIN
  -- Determinar nome do plano baseado no price_id
  CASE price_id
    WHEN 'price_1RdhpHG1GdQ2ZjmFmYXfEFJa' THEN 
      plan_name := 'monthly';
      expires_at := now() + INTERVAL '1 month';
    WHEN 'price_1RdhqYG1GdQ2ZjmFlAOaBr4A' THEN 
      plan_name := 'annual';
      expires_at := now() + INTERVAL '1 year';
    ELSE 
      plan_name := 'monthly';
      expires_at := now() + INTERVAL '1 month';
  END CASE;

  -- Buscar usuário pelo email
  SELECT * INTO user_record 
  FROM public.profiles 
  WHERE email = customer_email 
  LIMIT 1;

  IF event_type = 'checkout.session.completed' OR event_type = 'invoice.payment_succeeded' THEN
    IF user_record.id IS NOT NULL THEN
      -- Usuário existe, atualizar plano
      UPDATE public.profiles 
      SET 
        plan_type = plan_name,
        subscription_status = 'active',
        subscription_expires_at = expires_at,
        stripe_customer_id = customer_id,
        stripe_subscription_id = subscription_id,
        updated_at = now()
      WHERE id = user_record.id;
    ELSE
      -- Usuário não existe, criar registro pendente
      INSERT INTO public.profiles (
        id,
        email,
        name,
        plan_type,
        subscription_status,
        subscription_expires_at,
        stripe_customer_id,
        stripe_subscription_id,
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
    'plan_name', plan_name
  );
END;
$$;

-- Função para ativar conta de usuário que comprou antes de se cadastrar
CREATE OR REPLACE FUNCTION public.activate_purchased_account()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pending_profile RECORD;
BEGIN
  -- Verificar se existe um perfil pendente com o mesmo email
  SELECT * INTO pending_profile
  FROM public.profiles 
  WHERE email = NEW.email 
    AND subscription_status = 'pending_activation'
    AND id != NEW.id
  LIMIT 1;

  IF pending_profile.id IS NOT NULL THEN
    -- Ativar a conta com os dados da compra
    UPDATE public.profiles 
    SET 
      plan_type = pending_profile.plan_type,
      subscription_status = 'active',
      subscription_expires_at = pending_profile.subscription_expires_at,
      stripe_customer_id = pending_profile.stripe_customer_id,
      stripe_subscription_id = pending_profile.stripe_subscription_id,
      updated_at = now()
    WHERE id = NEW.id;

    -- Transferir orders para o usuário real
    UPDATE public.orders 
    SET user_id = NEW.id, updated_at = now()
    WHERE customer_email = NEW.email AND user_id IS NULL;

    -- Remover perfil pendente
    DELETE FROM public.profiles WHERE id = pending_profile.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Criar trigger para ativar conta automaticamente no login/cadastro
CREATE OR REPLACE TRIGGER activate_purchased_account_trigger
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.activate_purchased_account();

-- Função para verificar status de pagamento por session_id
CREATE OR REPLACE FUNCTION public.verify_payment_status(session_id_param TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  order_record RECORD;
BEGIN
  SELECT * INTO order_record
  FROM public.orders 
  WHERE stripe_session_id = session_id_param
  LIMIT 1;

  IF order_record.id IS NOT NULL THEN
    RETURN json_build_object(
      'found', true,
      'status', order_record.status,
      'plan_name', order_record.plan_name,
      'customer_email', order_record.customer_email,
      'amount', order_record.amount
    );
  ELSE
    RETURN json_build_object('found', false);
  END IF;
END;
$$;
