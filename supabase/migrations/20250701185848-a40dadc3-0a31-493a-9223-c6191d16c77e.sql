
-- Primeiro, vamos verificar se as políticas existem e removê-las se necessário
DROP POLICY IF EXISTS "Admins can upload template covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload template files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update template covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update template files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete template covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete template files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view template covers" ON storage.objects;
DROP POLICY IF EXISTS "Public can view template files" ON storage.objects;

-- Agora vamos criar as políticas corretas
-- Política para permitir que admins façam upload de imagens de capa
CREATE POLICY "Admins can upload template covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-covers'
  AND is_admin(auth.uid())
);

-- Política para permitir que admins façam upload de arquivos de template
CREATE POLICY "Admins can upload template files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-files'
  AND is_admin(auth.uid())
);

-- Política para permitir que admins atualizem arquivos de template
CREATE POLICY "Admins can update template covers" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-covers'
  AND is_admin(auth.uid())
);

-- Política para permitir que admins atualizem arquivos de template
CREATE POLICY "Admins can update template files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-files'
  AND is_admin(auth.uid())
);

-- Política para permitir que admins deletem arquivos de template
CREATE POLICY "Admins can delete template covers" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-covers'
  AND is_admin(auth.uid())
);

-- Política para permitir que admins deletem arquivos de template
CREATE POLICY "Admins can delete template files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-files'
  AND is_admin(auth.uid())
);

-- Política para acesso público a imagens de capa de templates
CREATE POLICY "Public can view template covers" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-covers'
);

-- Política para acesso público a arquivos de template
CREATE POLICY "Public can view template files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'template-files'
);
