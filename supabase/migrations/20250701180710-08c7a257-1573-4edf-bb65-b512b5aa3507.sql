
-- Criar tabela para templates prontos (templates administrativos)
CREATE TABLE public.admin_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  template_file_url TEXT,
  preview_url TEXT,
  canvas_data JSONB,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Ativar RLS na tabela
ALTER TABLE public.admin_templates ENABLE ROW LEVEL SECURITY;

-- Política para admins poderem gerenciar templates
CREATE POLICY "Admins can manage admin templates" 
  ON public.admin_templates 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Política para usuários autenticados poderem visualizar templates ativos
CREATE POLICY "Users can view active admin templates" 
  ON public.admin_templates 
  FOR SELECT 
  USING (is_active = true);

-- Política para acesso público aos templates (para usuários não logados também)
CREATE POLICY "Public can view active admin templates" 
  ON public.admin_templates 
  FOR SELECT 
  USING (is_active = true);

-- Criar índices para melhor performance
CREATE INDEX idx_admin_templates_name ON public.admin_templates(name);
CREATE INDEX idx_admin_templates_active ON public.admin_templates(is_active);
CREATE INDEX idx_admin_templates_created_at ON public.admin_templates(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_admin_templates_updated_at
    BEFORE UPDATE ON public.admin_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
