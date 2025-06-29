
-- First, drop the problematic trigger and function temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS update_user_session() CASCADE;

-- Add the missing columns for storing real payment amounts
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS annual_amount DECIMAL(10,2);

-- Set default values for existing users
UPDATE public.profiles 
SET 
  monthly_amount = 47.00,
  annual_amount = 397.00
WHERE monthly_amount IS NULL OR annual_amount IS NULL;

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.update_user_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only insert if the user exists in profiles table
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.user_sessions (user_id, session_token, last_activity)
    VALUES (NEW.id, 'session_' || NEW.id, now())
    ON CONFLICT (user_id, session_token)
    DO UPDATE SET last_activity = now();
  END IF;
  RETURN NEW;
END;
$$;
