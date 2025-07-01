
-- Atualizar a tabela profiles para incluir controle de teste gratuito
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS free_trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS free_trial_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days');

-- Criar tabela para rastreamento de criação de contas por IP
CREATE TABLE IF NOT EXISTS public.account_creation_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  email TEXT NOT NULL,
  fingerprint TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Função para verificar limite de contas por IP
CREATE OR REPLACE FUNCTION public.check_ip_account_limit(client_ip INET)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  account_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO account_count
  FROM public.account_creation_tracking
  WHERE ip_address = client_ip
    AND created_at > now() - INTERVAL '30 days';
  
  RETURN account_count;
END;
$$;

-- Função para verificar se o teste gratuito expirou
CREATE OR REPLACE FUNCTION public.is_free_trial_expired(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  SELECT * INTO profile_record
  FROM public.profiles
  WHERE id = user_id;
  
  IF profile_record.plan_type != 'free' THEN
    RETURN FALSE;
  END IF;
  
  IF profile_record.free_trial_expires_at IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN profile_record.free_trial_expires_at < now();
END;
$$;

-- Trigger para definir expiração do teste gratuito ao criar usuário
CREATE OR REPLACE FUNCTION public.set_free_trial_expiration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.plan_type = 'free' AND NEW.free_trial_expires_at IS NULL THEN
    NEW.free_trial_expires_at := now() + INTERVAL '30 days';
    NEW.free_trial_started_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para novos usuários
DROP TRIGGER IF EXISTS set_free_trial_trigger ON public.profiles;
CREATE TRIGGER set_free_trial_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_free_trial_expiration();

-- Atualizar usuários existentes que não têm data de expiração
UPDATE public.profiles 
SET 
  free_trial_started_at = COALESCE(free_trial_started_at, created_at, now()),
  free_trial_expires_at = COALESCE(free_trial_expires_at, created_at + INTERVAL '30 days', now() + INTERVAL '30 days')
WHERE plan_type = 'free' 
  AND (free_trial_expires_at IS NULL OR free_trial_started_at IS NULL);
