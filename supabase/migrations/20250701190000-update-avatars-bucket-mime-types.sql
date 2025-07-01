
-- Atualizar o bucket avatars para permitir arquivos JSON
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/gif', 
  'image/webp',
  'application/json'
]
WHERE id = 'avatars';
