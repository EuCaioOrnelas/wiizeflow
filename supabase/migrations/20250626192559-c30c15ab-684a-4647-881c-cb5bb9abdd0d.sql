
-- Adicionar campo para controle de aceitação de cookies
ALTER TABLE public.profiles 
ADD COLUMN cookies_accepted BOOLEAN DEFAULT FALSE;
